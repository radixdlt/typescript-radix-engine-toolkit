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

import { EntityAddress, PublicKey } from "..";
import { numberToString, stringToNumber } from "../../utils";

export class DeriveVirtualAccountAddressRequest {
  private _networkId: string;
  private _olympiaAccountAddress: string;

  public get networkId(): number {
    return stringToNumber(this._networkId);
  }
  public set networkId(value: number) {
    this._networkId = numberToString(value);
  }

  public get olympiaAccountAddress(): string {
    return this._olympiaAccountAddress;
  }
  public set olympiaAccountAddress(value: string) {
    this._olympiaAccountAddress = value;
  }

  constructor(networkId: number, olympiaAccountAddress: string) {
    this._networkId = numberToString(networkId);
    this._olympiaAccountAddress = olympiaAccountAddress;
  }
}

export class DeriveVirtualAccountAddress {
  private _babylonAccountAddress: EntityAddress.ComponentAddress;
  private _publicKey: PublicKey.Any;

  public get babylonAccountAddress(): EntityAddress.ComponentAddress {
    return this._babylonAccountAddress;
  }
  public set babylonAccountAddress(value: EntityAddress.ComponentAddress) {
    this._babylonAccountAddress = value;
  }

  public get publicKey(): PublicKey.Any {
    return this._publicKey;
  }
  public set publicKey(value: PublicKey.Any) {
    this._publicKey = value;
  }

  constructor(
    babylonAccountAddress: EntityAddress.ComponentAddress,
    publicKey: PublicKey.Any
  ) {
    this._babylonAccountAddress = babylonAccountAddress;
    this._publicKey = publicKey;
  }
}
