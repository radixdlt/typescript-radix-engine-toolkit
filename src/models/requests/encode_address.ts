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

import { EntityAddress } from "../../models";
import { numberToString, stringToNumber } from "../../utils";

export class EncodeAddressRequest {
  private _addressBytes: string;
  private _networkId: string;

  public get addressBytes(): string {
    return this._addressBytes;
  }
  public set addressBytes(value: string) {
    this._addressBytes = value;
  }

  public get networkId(): number {
    return stringToNumber(this._networkId);
  }
  public set networkId(value: number) {
    this._networkId = numberToString(value);
  }

  constructor(addressBytes: number, networkId: number) {
    this._addressBytes = numberToString(addressBytes);
    this._networkId = numberToString(networkId);
  }
}

export type EncodeAddressResponse = EntityAddress.Any;