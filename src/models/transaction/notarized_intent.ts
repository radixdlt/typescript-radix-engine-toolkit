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

import { InstructionList, SignedTransactionIntent } from ".";
import { Signature } from "../../models/crypto";
import { DecompileNotarizedTransactionIntentRequest } from "../../models/requests";
import { hash } from "../../utils";
import { RawRadixEngineToolkit } from "../../wrapper";

export class NotarizedTransaction {
  private _signedIntent: SignedTransactionIntent;
  private _notarySignature: Signature.Any;

  public get signedIntent(): SignedTransactionIntent {
    return this._signedIntent;
  }
  public set signedIntent(value: SignedTransactionIntent) {
    this._signedIntent = value;
  }

  public get notarySignature(): Signature.Any {
    return this._notarySignature;
  }
  public set notarySignature(value: Signature.Any) {
    this._notarySignature = value;
  }

  constructor(
    signedIntent: SignedTransactionIntent,
    notarySignature: Signature.Any
  ) {
    this._signedIntent = signedIntent;
    this._notarySignature = notarySignature;
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
}
