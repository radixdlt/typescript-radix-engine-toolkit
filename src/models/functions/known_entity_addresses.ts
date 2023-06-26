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

import { Expose, Transform, Type, instanceToPlain } from "class-transformer";
import * as Serializers from "../serializers";

export class KnownEntityAddressesInput {
  @Expose({ name: "network_id" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  networkId: number;

  constructor(networkId: number) {
    this.networkId = networkId;
  }
}

export class KnownEntityAddressesOutput {
  @Expose({ name: "faucet_component_address" })
  @Type(() => String)
  faucetComponentAddress: string;

  @Expose({ name: "faucet_package_address" })
  @Type(() => String)
  faucetPackageAddress: string;

  @Expose({ name: "account_package_address" })
  @Type(() => String)
  accountPackageAddress: string;

  @Expose({ name: "xrd_resource_address" })
  @Type(() => String)
  xrdResourceAddress: string;

  @Expose({ name: "system_token_resource_address" })
  @Type(() => String)
  systemTokenResourceAddress: string;

  @Expose({ name: "ecdsa_secp256k1_token_resource_address" })
  @Type(() => String)
  Secp256k1TokenResourceAddress: string;

  @Expose({ name: "eddsa_ed25519_token_resource_address" })
  @Type(() => String)
  Ed25519TokenResourceAddress: string;

  @Expose({ name: "package_token_resource_address" })
  @Type(() => String)
  packageTokenResourceAddress: string;

  @Expose({ name: "consensus_manager_system_address" })
  @Type(() => String)
  consensusManagerSystemAddress: string;

  constructor(
    faucetComponentAddress: string,
    faucetPackageAddress: string,
    accountPackageAddress: string,
    xrdResourceAddress: string,
    systemTokenResourceAddress: string,
    Secp256k1TokenResourceAddress: string,
    Ed25519TokenResourceAddress: string,
    packageTokenResourceAddress: string,
    consensusManagerSystemAddress: string
  ) {
    this.faucetComponentAddress = faucetComponentAddress;
    this.faucetPackageAddress = faucetPackageAddress;
    this.accountPackageAddress = accountPackageAddress;
    this.xrdResourceAddress = xrdResourceAddress;
    this.systemTokenResourceAddress = systemTokenResourceAddress;
    this.Secp256k1TokenResourceAddress =
      Secp256k1TokenResourceAddress;
    this.Ed25519TokenResourceAddress = Ed25519TokenResourceAddress;
    this.packageTokenResourceAddress = packageTokenResourceAddress;
    this.consensusManagerSystemAddress = consensusManagerSystemAddress;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
