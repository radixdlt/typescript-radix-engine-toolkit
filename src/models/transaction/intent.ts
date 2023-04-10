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

import { InstructionList, TransactionHeader, TransactionManifest } from ".";
import { DecompileTransactionIntentRequest } from "../../models/requests";
import { hash } from "../../utils";
import { RawRadixEngineToolkit } from "../../wrapper";

export class TransactionIntent {
  private _header: TransactionHeader;
  private _manifest: TransactionManifest;

  public get header(): TransactionHeader {
    return this._header;
  }
  public set header(value: TransactionHeader) {
    this._header = value;
  }

  public get manifest(): TransactionManifest {
    return this._manifest;
  }
  public set manifest(value: TransactionManifest) {
    this._manifest = value;
  }

  constructor(header: TransactionHeader, manifest: TransactionManifest) {
    this._header = header;
    this._manifest = manifest;
  }

  async compile(): Promise<Uint8Array> {
    return RawRadixEngineToolkit.compileTransactionIntent(this).then(
      (response) => response.compiledIntent
    );
  }

  static async decompile(
    compiledIntent: Uint8Array,
    instructionsOutputKind: InstructionList.Kind = InstructionList.Kind.String
  ): Promise<TransactionIntent> {
    return RawRadixEngineToolkit.decompileTransactionIntent(
      new DecompileTransactionIntentRequest(
        instructionsOutputKind,
        compiledIntent
      )
    );
  }

  async transactionId(): Promise<Uint8Array> {
    return this.compile().then(hash);
  }
}
