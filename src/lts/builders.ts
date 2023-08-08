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

import Decimal from "decimal.js";
import { LTS } from ".";

export interface SimpleTransactionBuilderSettings {
  networkId: number;
  validFromEpoch: number;
  fromAccount: string;
  signerPublicKey: LTS.PublicKey;
}

export interface SimpleTransactionBuilderFreeXrdSettings {
  networkId: number;
  validFromEpoch: number;
  toAccount: string;
}

type Action = {
  kind: "FungibleResourceTransfer";
  from: string;
  to: string;
  resourceAddress: string;
  amount: Decimal;
};
