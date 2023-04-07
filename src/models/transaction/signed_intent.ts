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

import { SignatureWithPublicKey } from "models/crypto";
import { TransactionIntent } from "./intent";

export class SignedTransactionIntent {
  private _intent: TransactionIntent;
  private _intentSignatures: Array<SignatureWithPublicKey.Any>;

  public get intent(): TransactionIntent {
    return this._intent;
  }
  public set intent(value: TransactionIntent) {
    this._intent = value;
  }

  public get intentSignatures(): Array<SignatureWithPublicKey.Any> {
    return this._intentSignatures;
  }
  public set intentSignatures(value: Array<SignatureWithPublicKey.Any>) {
    this._intentSignatures = value;
  }

  constructor(
    intent: TransactionIntent,
    intentSignatures: Array<SignatureWithPublicKey.Any>
  ) {
    this._intent = intent;
    this._intentSignatures = intentSignatures;
  }
}
