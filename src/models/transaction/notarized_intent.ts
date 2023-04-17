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
import {
  DecompileNotarizedTransactionIntentRequest,
  ValidationConfig,
} from "../../models/requests";
import { hash } from "../../utils";
import { RadixEngineToolkit, RawRadixEngineToolkit } from "../../wrapper";

export class NotarizedTransaction {
  @Expose({ name: "signed_intent" })
  @Type(() => SignedTransactionIntent)
  signedIntent: SignedTransactionIntent;

  @Expose({ name: "notary_signature" })
  @Type(() => Signature.Signature, {
    discriminator: {
      property: "curve",
      subTypes: [
        { name: "EcdsaSecp256k1", value: Signature.EcdsaSecp256k1 },
        { name: "EddsaEd25519", value: Signature.EddsaEd25519 },
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
      (response) => response.compiledIntent
    );
  }

  static async decompile(
    compiledIntent: Uint8Array,
    instructionsOutputKind: InstructionList.Kind = InstructionList.Kind.String
  ): Promise<NotarizedTransaction> {
    return RawRadixEngineToolkit.decompileNotarizedTransactionIntent(
      new DecompileNotarizedTransactionIntentRequest(
        instructionsOutputKind,
        compiledIntent
      )
    );
  }

  async transactionId(): Promise<Uint8Array> {
    return this.signedIntent.intent.transactionId();
  }

  async signedIntentHash(): Promise<Uint8Array> {
    return this.signedIntent.signedIntentHash();
  }

  async notarizedIntentHash(): Promise<Uint8Array> {
    return this.compile().then(hash);
  }

  async staticallyValidate(validationConfig: ValidationConfig): Promise<TransactionValidity> {
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
