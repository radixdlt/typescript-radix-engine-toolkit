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

import { numberToString, uint8ArrayToString } from "../../utils";

export class ValidationConfig {
  networkId: string;
  minCostUnitLimit: string;
  maxCostUnitLimit: string;
  minTipPercentage: string;
  maxTipPercentage: string;
  maxEpochRange: string;

  constructor(
    networkId: number,
    minCostUnitLimit: number,
    maxCostUnitLimit: number,
    minTipPercentage: number,
    maxTipPercentage: number,
    maxEpochRange: number
  ) {
    this.networkId = numberToString(networkId);
    this.minCostUnitLimit = numberToString(minCostUnitLimit);
    this.maxCostUnitLimit = numberToString(maxCostUnitLimit);
    this.minTipPercentage = numberToString(minTipPercentage);
    this.maxTipPercentage = numberToString(maxTipPercentage);
    this.maxEpochRange = numberToString(maxEpochRange);
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
  compiledNotarizedIntent: string;
  validationConfig: ValidationConfig;

  constructor(
    compiledNotarizedIntent: Uint8Array,
    validationConfig: ValidationConfig
  ) {
    this.compiledNotarizedIntent = uint8ArrayToString(compiledNotarizedIntent);
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
