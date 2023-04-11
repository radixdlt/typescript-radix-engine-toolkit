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

import {
  InstructionList,
  SignedTransactionIntent,
  TransactionIntent,
} from "../../models/transaction";
import { serialize, stringToUint8Array, uint8ArrayToString } from "../../utils";
import { DecompileNotarizedTransactionIntentResponse } from "./decompile_notarized_transaction_intent";
import { DecompileSignedTransactionIntentResponse } from "./decompile_signed_transaction_intent";
import { DecompileTransactionIntentResponse } from "./decompile_transaction_intent";

export class DecompileUnknownTransactionIntentRequest {
  private _instructionsOutputKind: InstructionList.Kind;
  private _compiledUnknownIntent: string;

  public get instructionsOutputKind(): InstructionList.Kind {
    return this._instructionsOutputKind;
  }
  public set instructionsOutputKind(value: InstructionList.Kind) {
    this._instructionsOutputKind = value;
  }

  public get compiledUnknownIntent(): Uint8Array {
    return stringToUint8Array(this._compiledUnknownIntent);
  }
  public set compiledUnknownIntent(value: Uint8Array) {
    this._compiledUnknownIntent = uint8ArrayToString(value);
  }

  constructor(
    instructionsOutputKind: InstructionList.Kind,
    compiledUnknownIntent: Uint8Array
  ) {
    this._instructionsOutputKind = instructionsOutputKind;
    this._compiledUnknownIntent = uint8ArrayToString(compiledUnknownIntent);
  }

  toString(): string {
    return serialize(this);
  }
}

export enum DecompileUnknownTransactionIntentResponseKind {
  TransactionIntent = "TransactionIntent",
  SignedTransactionIntent = "SignedTransactionIntent",
  NotarizedTransactionIntent = "NotarizedTransactionIntent",
}

export class DecompileUnknownTransactionIntentResponse {
  private _type: DecompileUnknownTransactionIntentResponseKind;
  private _value:
    | DecompileTransactionIntentResponse
    | DecompileSignedTransactionIntentResponse
    | DecompileNotarizedTransactionIntentResponse;

  public get type(): DecompileUnknownTransactionIntentResponseKind {
    return this._type;
  }

  public get value():
    | DecompileTransactionIntentResponse
    | DecompileSignedTransactionIntentResponse
    | DecompileNotarizedTransactionIntentResponse {
    return this._value;
  }
  public set value(
    value:
      | DecompileTransactionIntentResponse
      | DecompileSignedTransactionIntentResponse
      | DecompileNotarizedTransactionIntentResponse
  ) {
    this._value = value;
  }

  constructor(
    value:
      | DecompileTransactionIntentResponse
      | DecompileSignedTransactionIntentResponse
      | DecompileNotarizedTransactionIntentResponse
  ) {
    this._value = value;
    if (value instanceof TransactionIntent) {
      this._type =
        DecompileUnknownTransactionIntentResponseKind.TransactionIntent;
    } else if (value instanceof SignedTransactionIntent) {
      this._type =
        DecompileUnknownTransactionIntentResponseKind.SignedTransactionIntent;
    } else {
      // Not exactly true
      this._type =
        DecompileUnknownTransactionIntentResponseKind.NotarizedTransactionIntent;
    }
  }

  toString(): string {
    return serialize(this);
  }
}
