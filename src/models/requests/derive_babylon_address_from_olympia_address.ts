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
import { EntityAddress, PublicKey } from "..";
import * as Serializers from "../serializers";

export class DeriveBabylonAddressFromOlympiaAddressRequest {
  @Expose({ name: "network_id" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  networkId: number;

  @Expose({ name: "olympia_account_address" })
  olympiaAccountAddress: string;

  constructor(networkId: number, olympiaAccountAddress: string) {
    this.networkId = networkId;
    this.olympiaAccountAddress = olympiaAccountAddress;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class DeriveBabylonAddressFromOlympiaAddressResponse {
  @Expose({ name: "babylon_account_address" })
  @Type(() => EntityAddress.ComponentAddress)
  babylonAccountAddress: EntityAddress.ComponentAddress;

  @Expose({ name: "public_key" })
  @Type(() => PublicKey.PublicKey, {
    discriminator: {
      property: "curve",
      subTypes: [
        { name: "EcdsaSecp256k1", value: PublicKey.EcdsaSecp256k1 },
        { name: "EddsaEd25519", value: PublicKey.EddsaEd25519 },
      ],
    },
  })
  publicKey: PublicKey.PublicKey;

  constructor(
    babylonAccountAddress: EntityAddress.ComponentAddress,
    publicKey: PublicKey.PublicKey
  ) {
    this.babylonAccountAddress = babylonAccountAddress;
    this.publicKey = publicKey;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
