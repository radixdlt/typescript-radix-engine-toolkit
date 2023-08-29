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

import Decimal from "decimal.js";
import {
  Convert,
  Intent,
  LTSRadixEngineToolkit,
  NotarizedTransaction,
  RadixEngineToolkit,
  RawRadixEngineToolkit,
  Signature,
  SignatureSource,
  SignedIntent,
  SignerResponse,
  TransactionHash,
  defaultValidationConfig,
  resolveSignatureSource,
} from "..";
import { GeneratedConverter } from "../generated";

export class LTSTransactionIntent
  implements CompilableIntent, HasCompiledIntent
{
  private readonly intent: Intent;

  constructor(intent: Intent) {
    this.intent = intent;
  }

  compile(): Promise<Uint8Array> {
    return RadixEngineToolkit.Intent.compile(this.intent);
  }

  compiledIntent(): Promise<Uint8Array> {
    return this.compile();
  }

  async transactionId(): Promise<TransactionHash> {
    return RadixEngineToolkit.Intent.hash(this.intent);
  }
}

export class LTSSignedTransactionIntent
  implements CompilableIntent, HasCompiledIntent
{
  private readonly intent: SignedIntent;

  constructor(intent: SignedIntent) {
    this.intent = intent;
  }

  compile(): Promise<Uint8Array> {
    return RadixEngineToolkit.SignedIntent.compile(this.intent);
  }

  compiledIntent(): Promise<Uint8Array> {
    return new LTSTransactionIntent(this.intent.intent).compile();
  }

  async transactionId(): Promise<TransactionHash> {
    return this.intentHash();
  }

  async intentHash(): Promise<TransactionHash> {
    return RadixEngineToolkit.Intent.hash(this.intent.intent);
  }

  async signedIntentHash(): Promise<TransactionHash> {
    return RadixEngineToolkit.SignedIntent.hash(this.intent);
  }
}

export class LTSNotarizedTransaction
  implements CompilableIntent, HasCompiledIntent
{
  private readonly transaction: NotarizedTransaction;

  constructor(transaction: NotarizedTransaction) {
    this.transaction = transaction;
  }

  compile(): Promise<Uint8Array> {
    return RadixEngineToolkit.NotarizedTransaction.compile(this.transaction);
  }

  compiledIntent(): Promise<Uint8Array> {
    return new LTSTransactionIntent(
      this.transaction.signedIntent.intent
    ).compile();
  }

  async transactionId(): Promise<TransactionHash> {
    return this.intentHash();
  }

  async intentHash(): Promise<TransactionHash> {
    return RadixEngineToolkit.Intent.hash(this.transaction.signedIntent.intent);
  }

  async signedIntentHash(): Promise<TransactionHash> {
    return RadixEngineToolkit.SignedIntent.hash(this.transaction.signedIntent);
  }

  async notarizedPayloadHash(): Promise<TransactionHash> {
    return RadixEngineToolkit.NotarizedTransaction.hash(this.transaction);
  }
}

export interface CompilableIntent {
  compile(): Promise<Uint8Array>;
}

export class CompiledSignedTransactionIntent implements HasCompiledIntent {
  private readonly retWrapper: RawRadixEngineToolkit;
  private readonly signedIntent: SignedIntent;
  readonly intentHash: TransactionHash;
  readonly compiledSignedIntent: Uint8Array;
  readonly signedIntentHash: TransactionHash;

  constructor(
    retWrapper: RawRadixEngineToolkit,
    intentHash: TransactionHash,
    signedIntent: SignedIntent,
    compiledSignedIntent: Uint8Array,
    signedIntentHash: TransactionHash
  ) {
    this.retWrapper = retWrapper;
    this.intentHash = intentHash;
    this.signedIntent = signedIntent;
    this.compiledSignedIntent = compiledSignedIntent;
    this.signedIntentHash = signedIntentHash;
  }

  compiledIntent(): Promise<Uint8Array> {
    return new LTSTransactionIntent(this.signedIntent.intent).compile();
  }

  /**
   * @returns The hash to notarize (the signed intent hash)
   */
  get hashToNotarize(): Uint8Array {
    return this.signedIntentHash.hash;
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction.
   */
  get transactionId(): TransactionHash {
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
          case "Secp256k1":
            return new Signature.Secp256k1(signerResponse.signature);
          case "Ed25519":
            return new Signature.Ed25519(signerResponse.signature);
        }
      }
    );
    const notarizedTransaction: NotarizedTransaction = {
      signedIntent: this.signedIntent,
      notarySignature: notarySignature,
    };

    const [compiledNotarizedTransaction, notarizedPayloadHash] = (() => {
      const input =
        GeneratedConverter.NotarizedTransaction.toGenerated(
          notarizedTransaction
        );
      const compiled = Convert.HexString.toUint8Array(
        this.retWrapper.notarizedTransactionCompile(input)
      );
      const hash = GeneratedConverter.TransactionHash.fromGenerated(
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
    return Convert.Uint8Array.toHexString(this.intentHash.hash);
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
  readonly intentHash: TransactionHash;
  readonly notarizedPayloadHash: TransactionHash;

  constructor(
    intentHash: TransactionHash,
    compiled: Uint8Array,
    notarizedPayloadHash: TransactionHash
  ) {
    this.intentHash = intentHash;
    this.compiled = compiled;
    this.notarizedPayloadHash = notarizedPayloadHash;
  }

  compiledIntent(): Promise<Uint8Array> {
    return RadixEngineToolkit.NotarizedTransaction.decompile(
      this.compiled
    ).then((decompiled) =>
      new LTSNotarizedTransaction(decompiled).compiledIntent()
    );
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction.
   */
  get transactionId(): TransactionHash {
    return this.intentHash;
  }

  toByteArray(): Uint8Array {
    return this.compiled;
  }

  toHex(): string {
    return Convert.Uint8Array.toHexString(this.compiled);
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
   */
  intentHashHex(): string {
    return Convert.Uint8Array.toHexString(this.intentHash.hash);
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
    return Convert.Uint8Array.toHexString(this.notarizedPayloadHash.hash);
  }

  async staticallyValidate(networkId: number): Promise<TransactionValidity> {
    return RadixEngineToolkit.NotarizedTransaction.decompile(this.compiled)
      .then((decompiled) =>
        RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
          decompiled,
          defaultValidationConfig(networkId)
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
