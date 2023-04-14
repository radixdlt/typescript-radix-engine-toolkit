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
import { InstructionList, TransactionIntent } from ".";
import { SignatureWithPublicKey } from "../../models/crypto";
import { DecompileSignedTransactionIntentRequest } from "../../models/requests";
import { hash } from "../../utils";
import { RawRadixEngineToolkit } from "../../wrapper";

export class SignedTransactionIntent {
  @Expose()
  @Type(() => TransactionIntent)
  intent: TransactionIntent;

  @Expose({ name: "intent_signatures" })
  @Type(() => SignatureWithPublicKey.SignatureWithPublicKey, {
    discriminator: {
      property: "curve",
      subTypes: [
        {
          name: "EcdsaSecp256k1",
          value: SignatureWithPublicKey.EcdsaSecp256k1,
        },
        { name: "EddsaEd25519", value: SignatureWithPublicKey.EddsaEd25519 },
      ],
    },
  })
  intentSignatures: Array<SignatureWithPublicKey.SignatureWithPublicKey>;

  constructor(
    intent: TransactionIntent,
    intentSignatures: Array<SignatureWithPublicKey.SignatureWithPublicKey>
  ) {
    this.intent = intent;
    this.intentSignatures = intentSignatures;
  }

  async compile(): Promise<Uint8Array> {
    return RawRadixEngineToolkit.compileSignedTransactionIntent(this).then(
      (response) => response.compiledIntent
    );
  }

  static async decompile(
    compiledIntent: Uint8Array,
    instructionsOutputKind: InstructionList.Kind = InstructionList.Kind.String
  ): Promise<SignedTransactionIntent> {
    return RawRadixEngineToolkit.decompileSignedTransactionIntent(
      new DecompileSignedTransactionIntentRequest(
        instructionsOutputKind,
        compiledIntent
      )
    );
  }

  async transactionId(): Promise<Uint8Array> {
    return this.intent.transactionId();
  }

  async signedIntentHash(): Promise<Uint8Array> {
    return this.compile().then(hash);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
