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
import { Convert } from "../..";
import * as Serializers from "../serializers";

export class ValidationConfig {
  @Expose({ name: "network_id" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  networkId: number;

  @Expose({ name: "min_cost_unit_limit" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  minCostUnitLimit: number;

  @Expose({ name: "max_cost_unit_limit" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  maxCostUnitLimit: number;

  @Expose({ name: "min_tip_percentage" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  minTipPercentage: number;

  @Expose({ name: "max_tip_percentage" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  maxTipPercentage: number;

  @Expose({ name: "max_epoch_range" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  maxEpochRange: number;

  constructor(
    networkId: number,
    minCostUnitLimit: number,
    maxCostUnitLimit: number,
    minTipPercentage: number,
    maxTipPercentage: number,
    maxEpochRange: number
  ) {
    this.networkId = networkId;
    this.minCostUnitLimit = minCostUnitLimit;
    this.maxCostUnitLimit = maxCostUnitLimit;
    this.minTipPercentage = minTipPercentage;
    this.maxTipPercentage = maxTipPercentage;
    this.maxEpochRange = maxEpochRange;
  }

  public static default(networkId: number): ValidationConfig {
    return new ValidationConfig(
      networkId,
      1_000_000,
      100_000_000,
      0,
      0xffff,
      100
    );
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class StaticallyValidateTransactionRequest {
  @Expose({ name: "compiled_notarized_intent" })
  @Type(() => Uint8Array)
  compiledNotarizedIntent: Uint8Array;

  @Expose({ name: "validation_config" })
  @Type(() => ValidationConfig)
  validationConfig: ValidationConfig;

  constructor(
    compiledNotarizedIntent: Uint8Array | string,
    validationConfig: ValidationConfig
  ) {
    this.compiledNotarizedIntent = Convert.Uint8Array.from(
      compiledNotarizedIntent
    );
    this.validationConfig = validationConfig;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export type StaticallyValidateTransactionResponse =
  | StaticallyValidateTransactionResponseValid
  | StaticallyValidateTransactionResponseInvalid;

export enum StaticallyValidateTransactionResponseKind {
  Valid = "Valid",
  Invalid = "Invalid",
}

export class StaticallyValidateTransactionResponseValid {
  validity: StaticallyValidateTransactionResponseKind =
    StaticallyValidateTransactionResponseKind.Valid;

  constructor() {}

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class StaticallyValidateTransactionResponseInvalid {
  validity: StaticallyValidateTransactionResponseKind =
    StaticallyValidateTransactionResponseKind.Invalid;
  error: string;

  constructor(error: string) {
    this.error = error;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}
