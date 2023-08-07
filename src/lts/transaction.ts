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

import * as DefaultToolkit from "..";

export class TransactionIntent implements CompilableIntent {
  private readonly intent: DefaultToolkit.Intent;

  constructor(intent: DefaultToolkit.Intent) {
    this.intent = intent;
  }

  compile(): Promise<Uint8Array> {
    return DefaultToolkit.RadixEngineToolkit.Intent.compile(this.intent);
  }
}

export class SignedTransactionIntent implements CompilableIntent {
  private readonly intent: DefaultToolkit.SignedIntent;

  constructor(intent: DefaultToolkit.SignedIntent) {
    this.intent = intent;
  }

  compile(): Promise<Uint8Array> {
    return DefaultToolkit.RadixEngineToolkit.SignedIntent.compile(this.intent);
  }
}

export class NotarizedTransaction implements CompilableIntent {
  private readonly intent: DefaultToolkit.NotarizedTransaction;

  constructor(intent: DefaultToolkit.NotarizedTransaction) {
    this.intent = intent;
  }

  compile(): Promise<Uint8Array> {
    return DefaultToolkit.RadixEngineToolkit.NotarizedTransaction.compile(
      this.intent
    );
  }
}

export interface CompilableIntent {
  compile(): Promise<Uint8Array>;
}

export class CompiledNotarizedTransaction {
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
    return DefaultToolkit.Convert.Uint8Array.toHexString(this.compiled);
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
   */
  intentHashHex(): string {
    return DefaultToolkit.Convert.Uint8Array.toHexString(this.intentHash);
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
    return DefaultToolkit.Convert.Uint8Array.toHexString(
      this.notarizedPayloadHash
    );
  }

  async staticallyValidate(networkId: number): Promise<TransactionValidity> {
    return DefaultToolkit.RadixEngineToolkit.NotarizedTransaction.decompile(
      this.compiled
    )
      .then((decompiled) =>
        DefaultToolkit.RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
          decompiled,
          DefaultToolkit.defaultValidationConfig(networkId)
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
   * Decompiles and summarizes a compiled intent extracting information such as locked fees,
   * deposits, and withdrawals.
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
