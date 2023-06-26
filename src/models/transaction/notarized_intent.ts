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

import { Expose, Type, instanceToPlain } from "class-transformer";
import { TransactionValidity } from "wrapper/default";
import { InstructionList, SignedTransactionIntent } from ".";
import { Signature } from "../../models/crypto";
import { RadixEngineToolkit, RawRadixEngineToolkit } from "../../wrapper";
import {
  DecompileNotarizedTransactionIntentInput,
  ValidationConfig,
} from "../functions";

export class NotarizedTransaction {
  @Expose({ name: "signed_intent" })
  @Type(() => SignedTransactionIntent)
  signedIntent: SignedTransactionIntent;

  @Expose({ name: "notary_signature" })
  @Type(() => Signature.Signature, {
    discriminator: {
      property: "curve",
      subTypes: [
        { name: "Secp256k1", value: Signature.Secp256k1 },
        { name: "Ed25519", value: Signature.Ed25519 },
      ],
    },
  })
  notarySignature: Signature.Signature;

  constructor(
    signedIntent: SignedTransactionIntent,
    notarySignature: Signature.Signature
  ) {
    this.signedIntent = signedIntent;
    this.notarySignature = notarySignature;
  }

  async compile(): Promise<Uint8Array> {
    return RawRadixEngineToolkit.compileNotarizedTransactionIntent(this).then(
      (output) => output.compiledIntent
    );
  }

  static async decompile(
    compiledIntent: Uint8Array,
    instructionsOutputKind: InstructionList.Kind = InstructionList.Kind.String
  ): Promise<NotarizedTransaction> {
    return RawRadixEngineToolkit.decompileNotarizedTransactionIntent(
      new DecompileNotarizedTransactionIntentInput(
        instructionsOutputKind,
        compiledIntent
      )
    );
  }

  async transactionId(): Promise<Uint8Array> {
    return this.intentHash();
  }

  async intentHash(): Promise<Uint8Array> {
    return this.signedIntent.intent.transactionId();
  }

  async signedIntentHash(): Promise<Uint8Array> {
    return this.signedIntent.signedIntentHash();
  }

  async notarizedPayloadHash(): Promise<Uint8Array> {
    return RawRadixEngineToolkit.hashNotarizedTransaction(this).then(
      ({ hash }) => hash
    );
  }

  async staticallyValidate(
    validationConfig: ValidationConfig
  ): Promise<TransactionValidity> {
    return RadixEngineToolkit.staticallyValidateTransaction(
      this,
      validationConfig
    );
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
