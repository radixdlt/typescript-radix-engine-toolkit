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

export class KnownEntityAddressesRequest {
  private _networkId: string;

  public get networkId(): number {
    return stringToNumber(this._networkId);
  }
  public set networkId(value: number) {
    this._networkId = numberToString(value);
  }

  constructor(networkId: number) {
    this._networkId = numberToString(networkId);
  }
}

export class KnownEntityAddressesResponse {
  private _faucetComponentAddress: EntityAddress.ComponentAddress;
  private _faucetPackageAddress: EntityAddress.PackageAddress;
  private _accountPackageAddress: EntityAddress.PackageAddress;
  private _xrdResourceAddress: EntityAddress.ResourceAddress;
  private _systemTokenResourceAddress: EntityAddress.ResourceAddress;
  private _ecdsaSecp256k1TokenResourceAddress: EntityAddress.ResourceAddress;
  private _eddsaEd25519TokenResourceAddress: EntityAddress.ResourceAddress;
  private _packageTokenResourceAddress: EntityAddress.ResourceAddress;
  private _epochManagerSystemAddress: EntityAddress.ComponentAddress;
  private _clockSystemAddress: EntityAddress.ComponentAddress;

  get faucetComponentAddress(): EntityAddress.ComponentAddress {
    return this._faucetComponentAddress;
  }
  set faucetComponentAddress(
    faucetComponentAddress: EntityAddress.ComponentAddress
  ) {
    this._faucetComponentAddress = faucetComponentAddress;
  }

  get faucetPackageAddress(): EntityAddress.PackageAddress {
    return this._faucetPackageAddress;
  }
  set faucetPackageAddress(faucetPackageAddress: EntityAddress.PackageAddress) {
    this._faucetPackageAddress = faucetPackageAddress;
  }

  get accountPackageAddress(): EntityAddress.PackageAddress {
    return this._accountPackageAddress;
  }
  set accountPackageAddress(
    accountPackageAddress: EntityAddress.PackageAddress
  ) {
    this._accountPackageAddress = accountPackageAddress;
  }

  get xrdResourceAddress(): EntityAddress.ResourceAddress {
    return this._xrdResourceAddress;
  }
  set xrdResourceAddress(xrdResourceAddress: EntityAddress.ResourceAddress) {
    this._xrdResourceAddress = xrdResourceAddress;
  }

  get systemTokenResourceAddress(): EntityAddress.ResourceAddress {
    return this._systemTokenResourceAddress;
  }
  set systemTokenResourceAddress(
    systemTokenResourceAddress: EntityAddress.ResourceAddress
  ) {
    this._systemTokenResourceAddress = systemTokenResourceAddress;
  }

  get ecdsaSecp256k1TokenResourceAddress(): EntityAddress.ResourceAddress {
    return this._ecdsaSecp256k1TokenResourceAddress;
  }
  set ecdsaSecp256k1TokenResourceAddress(
    ecdsaSecp256k1TokenResourceAddress: EntityAddress.ResourceAddress
  ) {
    this._ecdsaSecp256k1TokenResourceAddress =
      ecdsaSecp256k1TokenResourceAddress;
  }

  get eddsaEd25519TokenResourceAddress(): EntityAddress.ResourceAddress {
    return this._eddsaEd25519TokenResourceAddress;
  }
  set eddsaEd25519TokenResourceAddress(
    eddsaEd25519TokenResourceAddress: EntityAddress.ResourceAddress
  ) {
    this._eddsaEd25519TokenResourceAddress = eddsaEd25519TokenResourceAddress;
  }

  get packageTokenResourceAddress(): EntityAddress.ResourceAddress {
    return this._packageTokenResourceAddress;
  }
  set packageTokenResourceAddress(
    packageTokenResourceAddress: EntityAddress.ResourceAddress
  ) {
    this._packageTokenResourceAddress = packageTokenResourceAddress;
  }

  get epochManagerSystemAddress(): EntityAddress.ComponentAddress {
    return this._epochManagerSystemAddress;
  }
  set epochManagerSystemAddress(
    epochManagerSystemAddress: EntityAddress.ComponentAddress
  ) {
    this._epochManagerSystemAddress = epochManagerSystemAddress;
  }

  get clockSystemAddress(): EntityAddress.ComponentAddress {
    return this._clockSystemAddress;
  }
  set clockSystemAddress(clockSystemAddress: EntityAddress.ComponentAddress) {
    this._clockSystemAddress = clockSystemAddress;
  }

  constructor(
    faucetComponentAddress: EntityAddress.ComponentAddress,
    faucetPackageAddress: EntityAddress.PackageAddress,
    accountPackageAddress: EntityAddress.PackageAddress,
    xrdResourceAddress: EntityAddress.ResourceAddress,
    systemTokenResourceAddress: EntityAddress.ResourceAddress,
    ecdsaSecp256k1TokenResourceAddress: EntityAddress.ResourceAddress,
    eddsaEd25519TokenResourceAddress: EntityAddress.ResourceAddress,
    packageTokenResourceAddress: EntityAddress.ResourceAddress,
    epochManagerSystemAddress: EntityAddress.ComponentAddress,
    clockSystemAddress: EntityAddress.ComponentAddress
  ) {
    this._faucetComponentAddress = faucetComponentAddress;
    this._faucetPackageAddress = faucetPackageAddress;
    this._accountPackageAddress = accountPackageAddress;
    this._xrdResourceAddress = xrdResourceAddress;
    this._systemTokenResourceAddress = systemTokenResourceAddress;
    this._ecdsaSecp256k1TokenResourceAddress =
      ecdsaSecp256k1TokenResourceAddress;
    this._eddsaEd25519TokenResourceAddress = eddsaEd25519TokenResourceAddress;
    this._packageTokenResourceAddress = packageTokenResourceAddress;
    this._epochManagerSystemAddress = epochManagerSystemAddress;
    this._clockSystemAddress = clockSystemAddress;
  }
}
