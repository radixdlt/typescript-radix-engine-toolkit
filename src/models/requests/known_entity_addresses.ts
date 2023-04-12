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
import { numberToString } from "../../utils";

export class KnownEntityAddressesRequest {
  networkId: string;

  constructor(networkId: number) {
    this.networkId = numberToString(networkId);
  }
}

export class KnownEntityAddressesResponse {
  faucetComponentAddress: EntityAddress.ComponentAddress;
  faucetPackageAddress: EntityAddress.PackageAddress;
  accountPackageAddress: EntityAddress.PackageAddress;
  xrdResourceAddress: EntityAddress.ResourceAddress;
  systemTokenResourceAddress: EntityAddress.ResourceAddress;
  ecdsaSecp256k1TokenResourceAddress: EntityAddress.ResourceAddress;
  eddsaEd25519TokenResourceAddress: EntityAddress.ResourceAddress;
  packageTokenResourceAddress: EntityAddress.ResourceAddress;
  epochManagerSystemAddress: EntityAddress.ComponentAddress;
  clockSystemAddress: EntityAddress.ComponentAddress;

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
    this.faucetComponentAddress = faucetComponentAddress;
    this.faucetPackageAddress = faucetPackageAddress;
    this.accountPackageAddress = accountPackageAddress;
    this.xrdResourceAddress = xrdResourceAddress;
    this.systemTokenResourceAddress = systemTokenResourceAddress;
    this.ecdsaSecp256k1TokenResourceAddress =
      ecdsaSecp256k1TokenResourceAddress;
    this.eddsaEd25519TokenResourceAddress = eddsaEd25519TokenResourceAddress;
    this.packageTokenResourceAddress = packageTokenResourceAddress;
    this.epochManagerSystemAddress = epochManagerSystemAddress;
    this.clockSystemAddress = clockSystemAddress;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}
