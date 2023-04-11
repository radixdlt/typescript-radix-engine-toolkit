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

import { InstructionList, NotarizedTransaction } from "models/transaction";
import { serialize, stringToUint8Array, uint8ArrayToString } from "../../utils";

export class DecompileNotarizedTransactionIntentRequest {
  private _instructionsOutputKind: InstructionList.Kind;
  private _compiledNotarizedIntent: string;

  public get instructionsOutputKind(): InstructionList.Kind {
    return this._instructionsOutputKind;
  }
  public set instructionsOutputKind(value: InstructionList.Kind) {
    this._instructionsOutputKind = value;
  }

  public get compiledNotarizedIntent(): Uint8Array {
    return stringToUint8Array(this._compiledNotarizedIntent);
  }
  public set compiledNotarizedIntent(value: Uint8Array) {
    this._compiledNotarizedIntent = uint8ArrayToString(value);
  }

  constructor(
    instructionsOutputKind: InstructionList.Kind,
    compiledNotarizedIntent: Uint8Array
  ) {
    this._instructionsOutputKind = instructionsOutputKind;
    this._compiledNotarizedIntent = uint8ArrayToString(compiledNotarizedIntent);
  }

  toString(): string {
    return serialize(this);
  }
}

export type DecompileNotarizedTransactionIntentResponse = NotarizedTransaction;
