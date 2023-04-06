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

import { stringToUint8Array, uint8ArrayToString } from "../../utils";
import { Curve } from "./curve";

export type Any = EcdsaSecp256k1 | EddsaEd25519;

export class EcdsaSecp256k1 {
  private _curve: Curve = Curve.EcdsaSecp256k1;
  private _signature: string;

  public get signature(): Uint8Array {
    return stringToUint8Array(this._signature);
  }
  public set signature(value: Uint8Array) {
    this._signature = uint8ArrayToString(value);
  }

  public get curve(): Curve {
    return this._curve;
  }

  constructor(signature: Uint8Array) {
    this._signature = uint8ArrayToString(signature);
  }
}

export class EddsaEd25519 {
  private _curve: Curve = Curve.EddsaEd25519;
  private _signature: string;
  private _publicKey: string;

  public get signature(): Uint8Array {
    return stringToUint8Array(this._signature);
  }
  public set signature(value: Uint8Array) {
    this._signature = uint8ArrayToString(value);
  }

  public get publicKey(): Uint8Array {
    return stringToUint8Array(this._publicKey);
  }
  public set publicKey(value: Uint8Array) {
    this._publicKey = uint8ArrayToString(value);
  }

  public get curve(): Curve {
    return this._curve;
  }

  constructor(signature: Uint8Array, publicKey: Uint8Array) {
    this._signature = uint8ArrayToString(signature);
    this._publicKey = uint8ArrayToString(publicKey);
  }
}
