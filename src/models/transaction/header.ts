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

import { numberToString } from "../../utils";
import { PublicKey } from "../crypto";

/**
 * A transaction header containing metadata and other transaction information.
 */
export class TransactionHeader {
  version: string;
  networkId: string;
  startEpochInclusive: string;
  endEpochExclusive: string;
  nonce: string;
  notaryPublicKey: PublicKey.Any;
  notaryAsSignatory: boolean;
  costUnitLimit: string;
  tipPercentage: string;

  constructor(
    version: number,
    networkId: number,
    startEpochInclusive: number,
    endEpochExclusive: number,
    nonce: number,
    notaryPublicKey: PublicKey.Any,
    notaryAsSignatory: boolean,
    costUnitLimit: number,
    tipPercentage: number
  ) {
    this.version = numberToString(version);
    this.networkId = numberToString(networkId);
    this.startEpochInclusive = numberToString(startEpochInclusive);
    this.endEpochExclusive = numberToString(endEpochExclusive);
    this.nonce = numberToString(nonce);
    this.notaryPublicKey = notaryPublicKey;
    this.notaryAsSignatory = notaryAsSignatory;
    this.costUnitLimit = numberToString(costUnitLimit);
    this.tipPercentage = numberToString(tipPercentage);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}
