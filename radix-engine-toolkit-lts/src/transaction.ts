// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import * as Toolkit from "@radixdlt/radix-engine-toolkit";
import Decimal from "decimal.js";
import {
  Curve,
  Signature,
  SignatureSource,
  SignerResponse,
  resolveSignatureSource,
} from "./cryptography";
import { LTSRadixEngineToolkit } from "./toolkit";

export class TransactionIntent implements CompilableIntent, HasCompiledIntent {
  private readonly intent: Toolkit.Intent;

  constructor(intent: Toolkit.Intent) {
    this.intent = intent;
  }

  compile(): Promise<Uint8Array> {
    return Toolkit.RadixEngineToolkit.Intent.compile(this.intent);
  }

  compiledIntent(): Promise<Uint8Array> {
    return this.compile();
  }

  async transactionId(): Promise<Uint8Array> {
    return Toolkit.RadixEngineToolkit.Intent.hash(this.intent);
  }
}

export class SignedTransactionIntent
  implements CompilableIntent, HasCompiledIntent
{
  private readonly intent: Toolkit.SignedIntent;

  constructor(intent: Toolkit.SignedIntent) {
    this.intent = intent;
  }

  compile(): Promise<Uint8Array> {
    return Toolkit.RadixEngineToolkit.SignedIntent.compile(this.intent);
  }

  compiledIntent(): Promise<Uint8Array> {
    return new TransactionIntent(this.intent.intent).compile();
  }

  async transactionId(): Promise<Uint8Array> {
    return this.intentHash();
  }

  async intentHash(): Promise<Uint8Array> {
    return Toolkit.RadixEngineToolkit.Intent.hash(this.intent.intent);
  }

  async signedIntentHash(): Promise<Uint8Array> {
    return Toolkit.RadixEngineToolkit.SignedIntent.hash(this.intent);
  }
}

export class NotarizedTransaction
  implements CompilableIntent, HasCompiledIntent
{
  private readonly transaction: Toolkit.NotarizedTransaction;

  constructor(transaction: Toolkit.NotarizedTransaction) {
    this.transaction = transaction;
  }

  compile(): Promise<Uint8Array> {
    return Toolkit.RadixEngineToolkit.NotarizedTransaction.compile(
      this.transaction
    );
  }

  compiledIntent(): Promise<Uint8Array> {
    return new TransactionIntent(
      this.transaction.signedIntent.intent
    ).compile();
  }

  async transactionId(): Promise<Uint8Array> {
    return this.intentHash();
  }

  async intentHash(): Promise<Uint8Array> {
    return Toolkit.RadixEngineToolkit.Intent.hash(
      this.transaction.signedIntent.intent
    );
  }

  async signedIntentHash(): Promise<Uint8Array> {
    return Toolkit.RadixEngineToolkit.SignedIntent.hash(
      this.transaction.signedIntent
    );
  }

  async notarizedPayloadHash(): Promise<Uint8Array> {
    return Toolkit.RadixEngineToolkit.NotarizedTransaction.hash(
      this.transaction
    );
  }
}

export interface CompilableIntent {
  compile(): Promise<Uint8Array>;
}

export class CompiledSignedTransactionIntent implements HasCompiledIntent {
  private readonly retWrapper: Toolkit.RawRadixEngineToolkit;
  private readonly signedIntent: Toolkit.SignedIntent;
  readonly intentHash: Uint8Array;
  readonly compiledSignedIntent: Uint8Array;
  readonly signedIntentHash: Uint8Array;

  constructor(
    retWrapper: Toolkit.RawRadixEngineToolkit,
    intentHash: Uint8Array,
    signedIntent: Toolkit.SignedIntent,
    compiledSignedIntent: Uint8Array,
    signedIntentHash: Uint8Array
  ) {
    this.retWrapper = retWrapper;
    this.intentHash = intentHash;
    this.signedIntent = signedIntent;
    this.compiledSignedIntent = compiledSignedIntent;
    this.signedIntentHash = signedIntentHash;
  }

  compiledIntent(): Promise<Uint8Array> {
    return new TransactionIntent(this.signedIntent.intent).compile();
  }

  /**
   * @returns The hash to notarize (the signed intent hash)
   */
  get hashToNotarize(): Uint8Array {
    return this.signedIntentHash;
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction.
   */
  get transactionId(): Uint8Array {
    return this.intentHash;
  }

  toByteArray(): Uint8Array {
    return this.compiledSignedIntent;
  }

  compileNotarized(
    source: SignatureSource<Signature>
  ): CompiledNotarizedTransaction {
    const notarySignature = resolveSignatureSource(
      source,
      this.hashToNotarize,
      (signerResponse: SignerResponse): Signature => {
        switch (signerResponse.curve) {
          case Curve.Secp256k1:
            return new Signature.Secp256k1(signerResponse.signature);
          case Curve.Ed25519:
            return new Signature.Ed25519(signerResponse.signature);
        }
      }
    );
    const notarizedTransaction: Toolkit.NotarizedTransaction = {
      signedIntent: this.signedIntent,
      notarySignature: {
        kind: notarySignature.curve,
        signature: notarySignature.bytes,
      },
    };

    const [compiledNotarizedTransaction, notarizedPayloadHash] = (() => {
      const input =
        Toolkit.GeneratedConverter.NotarizedTransaction.toGenerated(
          notarizedTransaction
        );
      const compiled = Toolkit.Convert.HexString.toUint8Array(
        this.retWrapper.notarizedTransactionCompile(input)
      );
      const hash = Toolkit.Convert.HexString.toUint8Array(
        this.retWrapper.notarizedTransactionHash(input)
      );
      return [compiled, hash];
    })();

    return new CompiledNotarizedTransaction(
      this.intentHash,
      compiledNotarizedTransaction,
      notarizedPayloadHash
    );
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
   */
  intentHashHex(): string {
    return Toolkit.Convert.Uint8Array.toHexString(this.intentHash);
  }

  /**
   * Decompiles and summarizes a compiled intent extracting information such as locked fees,
   * deposits, and withdrawals.
   */
  summarizeTransaction(): Promise<TransactionSummary> {
    return LTSRadixEngineToolkit.Transaction.summarizeTransaction(this);
  }
}

export class CompiledNotarizedTransaction implements HasCompiledIntent {
  readonly compiled: Uint8Array;
  readonly intentHash: Uint8Array;
  readonly notarizedPayloadHash: Uint8Array;

  constructor(
    intentHash: Uint8Array,
    compiled: Uint8Array,
    notarizedPayloadHash: Uint8Array
  ) {
    this.intentHash = intentHash;
    this.compiled = compiled;
    this.notarizedPayloadHash = notarizedPayloadHash;
  }

  compiledIntent(): Promise<Uint8Array> {
    return Toolkit.RadixEngineToolkit.NotarizedTransaction.decompile(
      this.compiled
    ).then((decompiled) =>
      new NotarizedTransaction(decompiled).compiledIntent()
    );
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction.
   */
  get transactionId(): Uint8Array {
    return this.intentHash;
  }

  toByteArray(): Uint8Array {
    return this.compiled;
  }

  toHex(): string {
    return Toolkit.Convert.Uint8Array.toHexString(this.compiled);
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
   */
  intentHashHex(): string {
    return Toolkit.Convert.Uint8Array.toHexString(this.intentHash);
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
   */
  transactionIdHex(): string {
    return this.intentHashHex();
  }

  /**
   * @returns The (notarized) payload hash, encoded into hex.
   */
  notarizedPayloadHashHex(): string {
    return Toolkit.Convert.Uint8Array.toHexString(this.notarizedPayloadHash);
  }

  async staticallyValidate(networkId: number): Promise<TransactionValidity> {
    return Toolkit.RadixEngineToolkit.NotarizedTransaction.decompile(
      this.compiled
    )
      .then((decompiled) =>
        Toolkit.RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
          decompiled,
          Toolkit.defaultValidationConfig(networkId)
        )
      )
      .then((validity) => {
        switch (validity.kind) {
          case "Valid":
            return {
              isValid: true,
              errorMessage: undefined,
              throwIfInvalid: () => {},
            };
          case "Invalid":
            return {
              isValid: false,
              errorMessage: validity.error,
              throwIfInvalid: () => {
                throw new Error(
                  `Static validation failed with error: ${validity.error}`
                );
              },
            };
        }
      });
  }

  /**
   * Summarizes a compiled intent extracting information such as locked fees, deposits, and
   * withdrawals.
   */
  summarizeTransaction(): Promise<TransactionSummary> {
    return LTSRadixEngineToolkit.Transaction.summarizeTransaction(this);
  }
}

export interface TransactionValidity {
  /**
   * A boolean that indicates whether or not the transaction is valid.
   */
  isValid: boolean;

  /**
   * An optional error message. This message only exists if the transaction is invalid.
   */
  errorMessage: string | undefined;

  throwIfInvalid(): void;
}

export interface TransactionSummary {
  /// Information on which account this fee was locked against.
  feesLocked: {
    account: string;
    amount: Decimal;
  };

  /// A record of the withdrawn resources. Maps the account address to a mapping of the resource
  /// address and amount.
  withdraws: Record<string, Record<string, Decimal>>;

  /// A record of the deposited resources. Maps the account address to a mapping of the resource
  /// address and amount.
  deposits: Record<string, Record<string, Decimal>>;
}

export interface HasCompiledIntent {
  compiledIntent(): Promise<Uint8Array>;
}
