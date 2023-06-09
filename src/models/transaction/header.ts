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
import { PublicKey } from "../crypto";
import * as Serializers from "../serializers";

/**
 * A transaction header containing metadata and other transaction information.
 */
export class TransactionHeader {
  @Expose({ name: "version" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  version: number;

  @Expose({ name: "network_id" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  networkId: number;

  @Expose({ name: "start_epoch_inclusive" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  startEpochInclusive: number;

  @Expose({ name: "end_epoch_exclusive" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  endEpochExclusive: number;

  @Expose({ name: "nonce" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  nonce: number;

  @Expose({ name: "notary_public_key" })
  @Type(() => PublicKey.PublicKey, {
    discriminator: {
      property: "curve",
      subTypes: [
        { name: "EcdsaSecp256k1", value: PublicKey.EcdsaSecp256k1 },
        { name: "EddsaEd25519", value: PublicKey.EddsaEd25519 },
      ],
    },
  })
  notaryPublicKey: PublicKey.PublicKey;

  @Expose({ name: "notary_as_signatory" })
  notaryAsSignatory: boolean;

  @Expose({ name: "cost_unit_limit" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  costUnitLimit: number;

  @Expose({ name: "tip_percentage" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  tipPercentage: number;

  constructor(
    version: number,
    networkId: number,
    startEpochInclusive: number,
    endEpochExclusive: number,
    nonce: number,
    notaryPublicKey: PublicKey.PublicKey,
    notaryAsSignatory: boolean,
    costUnitLimit: number,
    tipPercentage: number
  ) {
    this.version = version;
    this.networkId = networkId;
    this.startEpochInclusive = startEpochInclusive;
    this.endEpochExclusive = endEpochExclusive;
    this.nonce = nonce;
    this.notaryPublicKey = notaryPublicKey;
    this.notaryAsSignatory = notaryAsSignatory;
    this.costUnitLimit = costUnitLimit;
    this.tipPercentage = tipPercentage;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
