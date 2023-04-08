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

import {
  numberToString,
  stringToNumber,
  stringToUint8Array,
  uint8ArrayToString,
} from "../../utils";

export class ValidationConfig {
  private _networkId: string;
  private _minCostUnitLimit: string;
  private _maxCostUnitLimit: string;
  private _minTipPercentage: string;
  private _maxTipPercentage: string;
  private _maxEpochRange: string;

  public get networkId(): number {
    return stringToNumber(this._networkId);
  }
  public set networkId(value: number) {
    this._networkId = numberToString(this.networkId);
  }

  public get minCostUnitLimit(): number {
    return stringToNumber(this._minCostUnitLimit);
  }
  public set minCostUnitLimit(value: number) {
    this._minCostUnitLimit = numberToString(this.minCostUnitLimit);
  }

  public get maxCostUnitLimit(): number {
    return stringToNumber(this._maxCostUnitLimit);
  }
  public set maxCostUnitLimit(value: number) {
    this._maxCostUnitLimit = numberToString(this.maxCostUnitLimit);
  }

  public get minTipPercentage(): number {
    return stringToNumber(this._minTipPercentage);
  }
  public set minTipPercentage(value: number) {
    this._minTipPercentage = numberToString(this.minTipPercentage);
  }

  public get maxTipPercentage(): number {
    return stringToNumber(this._maxTipPercentage);
  }
  public set maxTipPercentage(value: number) {
    this._maxTipPercentage = numberToString(this.maxTipPercentage);
  }

  public get maxEpochRange(): number {
    return stringToNumber(this._maxEpochRange);
  }
  public set maxEpochRange(value: number) {
    this._maxEpochRange = numberToString(this.maxEpochRange);
  }

  constructor(
    networkId: number,
    minCostUnitLimit: number,
    maxCostUnitLimit: number,
    minTipPercentage: number,
    maxTipPercentage: number,
    maxEpochRange: number
  ) {
    this._networkId = numberToString(networkId);
    this._minCostUnitLimit = numberToString(minCostUnitLimit);
    this._maxCostUnitLimit = numberToString(maxCostUnitLimit);
    this._minTipPercentage = numberToString(minTipPercentage);
    this._maxTipPercentage = numberToString(maxTipPercentage);
    this._maxEpochRange = numberToString(maxEpochRange);
  }

  public default(networkId: number): ValidationConfig {
    return new ValidationConfig(
      networkId,
      1_000_000,
      100_000_000,
      0,
      0xffff,
      100
    );
  }
}

export class StaticallyValidateTransactionRequest {
  private _compiledNotarizedIntent: string;
  private _validationConfig: ValidationConfig;

  public get compiledNotarizedIntent(): Uint8Array {
    return stringToUint8Array(this._compiledNotarizedIntent);
  }
  public set compiledNotarizedIntent(value: Uint8Array) {
    this._compiledNotarizedIntent = uint8ArrayToString(value);
  }

  public get validationConfig(): ValidationConfig {
    return this._validationConfig;
  }
  public set validationConfig(value: ValidationConfig) {
    this._validationConfig = value;
  }

  constructor(
    compiledNotarizedIntent: Uint8Array,
    validationConfig: ValidationConfig
  ) {
    this._compiledNotarizedIntent = uint8ArrayToString(compiledNotarizedIntent);
    this._validationConfig = validationConfig;
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
  private _validity: StaticallyValidateTransactionResponseKind =
    StaticallyValidateTransactionResponseKind.Valid;

  constructor() {}
}

export class StaticallyValidateTransactionResponseInvalid {
  private _validity: StaticallyValidateTransactionResponseKind =
    StaticallyValidateTransactionResponseKind.Invalid;
  private _error: string;

  public get error(): string {
    return this._error;
  }
  public set error(value: string) {
    this._error = value;
  }

  constructor(error: string) {
    this._error = error;
  }
}
