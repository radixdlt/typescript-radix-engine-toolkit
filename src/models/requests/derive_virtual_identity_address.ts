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

import { EntityAddress } from "..";
import { numberToString, serialize, stringToNumber } from "../../utils";
import { PublicKey } from "../crypto";

export class DeriveVirtualIdentityAddressRequest {
  private _networkId: string;
  private _publicKey: PublicKey.Any;

  public get networkId(): number {
    return stringToNumber(this._networkId);
  }
  public set networkId(value: number) {
    this._networkId = numberToString(value);
  }

  public get publicKey(): PublicKey.Any {
    return this._publicKey;
  }
  public set publicKey(value: PublicKey.Any) {
    this._publicKey = value;
  }

  constructor(networkId: number, publicKey: PublicKey.Any) {
    this._networkId = numberToString(networkId);
    this._publicKey = publicKey;
  }

  toString(): string {
    return serialize(this);
  }
}

export class DeriveVirtualIdentityAddressResponse {
  private _virtualIdentityAddress: EntityAddress.ComponentAddress;

  public get virtualIdentityAddress(): EntityAddress.ComponentAddress {
    return this._virtualIdentityAddress;
  }
  public set virtualIdentityAddress(value: EntityAddress.ComponentAddress) {
    this._virtualIdentityAddress = value;
  }

  constructor(virtualIdentityAddress: EntityAddress.ComponentAddress) {
    this._virtualIdentityAddress = virtualIdentityAddress;
  }

  toString(): string {
    return serialize(this);
  }
}
