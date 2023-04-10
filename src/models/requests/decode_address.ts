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

import { EntityAddress } from "../../";
import {
  numberToString,
  stringToNumber,
  stringToUint8Array,
  uint8ArrayToString,
} from "../../utils";

export class DecodeAddressRequest {
  private _address: string;

  public get address(): string {
    return this._address;
  }
  public set address(value: string) {
    this._address = value;
  }

  constructor(address: string) {
    this._address = address;
  }
}

export class DecodeAddressResponse {
  private _networkId: string;
  private _networkName: string;
  private _entityType: EntityAddress.EntityType;
  private _data: string;
  private _hrp: string;

  public get networkId(): number {
    return stringToNumber(this._networkId);
  }
  public set networkId(value: number) {
    this._networkId = numberToString(value);
  }

  public get networkName(): string {
    return this._networkName;
  }
  public set networkName(value: string) {
    this._networkName = value;
  }

  public get entityType(): EntityAddress.EntityType {
    return this._entityType;
  }
  public set entityType(value: EntityAddress.EntityType) {
    this._entityType = value;
  }

  public get data(): Uint8Array {
    return stringToUint8Array(this._data);
  }
  public set data(value: Uint8Array) {
    this._data = uint8ArrayToString(value);
  }

  public get hrp(): string {
    return this._hrp;
  }
  public set hrp(value: string) {
    this._hrp = value;
  }

  constructor(
    networkId: number,
    networkName: string,
    entityType: EntityAddress.EntityType,
    data: Uint8Array,
    hrp: string
  ) {
    this._networkId = numberToString(networkId);
    this._networkName = networkName;
    this._entityType = entityType;
    this._data = uint8ArrayToString(data);
    this._hrp = hrp;
  }
}
