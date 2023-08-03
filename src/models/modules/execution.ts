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

export interface ExecutionAnalysis {
  feeLocks: FeeLocks;
  feeSummary: FeeSummary;
  transactionTypes: TransactionType[];
}

export type TransactionType =
  | {
      kind: "SimpleTransfer";
      from: string;
      to: string;
      transferred: ResourceSpecifier;
    }
  | {
      kind: "Transfer";
      from: string;
      transfers: Record<string, Record<string, Resources>>;
    }
  | {
      kind: "AccountDepositSettings";
      resourcePreferenceChanges: Record<
        string,
        Record<string, ResourceDepositRule>
      >;
      defaultDepositRuleChanges: Record<string, AccountDefaultDepositRule>;
      authorizedDepositorsChanges: Record<string, AuthorizedDepositorsChanges>;
    }
  | {
      kind: "GeneralTransaction";
      accountProofs: string[];
      accountWithdraws: Record<string, ResourceTracker[]>;
      accountDeposits: Record<string, ResourceTracker[]>;
      addressesInManifest: Record<string, Set<string>>;
      dataOfNewlyMintedNonFungibles: Record<string, Record<string, Uint8Array>>;
    };

export type ResourceSpecifier =
  | {
      kind: "Amount";
      resourceAddress: string;
      amount: Decimal;
    }
  | {
      kind: "Ids";
      resourceAddress: string;
      ids: string[];
    };

export type Resources =
  | { kind: "Amount"; amount: Decimal }
  | { kind: "Ids"; nonFungibleLocalId: string[] };

export enum ResourceDepositRule {
  Neither = "Neither",
  Allowed = "Allowed",
  Disallowed = "Disallowed",
}

export enum AccountDefaultDepositRule {
  Accept = "Accept",
  Reject = "Reject",
  AllowExisting = "AllowExisting",
}

export interface AuthorizedDepositorsChanges {
  added: ResourceOrNonFungible[];
  removed: ResourceOrNonFungible[];
}

export type ResourceOrNonFungible =
  | { kind: "NonFungible"; nonFungibleGlobalId: string }
  | { kind: "Resource"; resourceAddress: string };

export type ResourceTracker =
  | {
      kind: "Fungible";
      resourceAddress: string;
      amount: Source<Decimal>;
    }
  | {
      kind: "NonFungible";
      resourceAddress: string;
      amount: Source<Decimal>;
      ids: Source<string[]>;
    };

export type Source<T> =
  | {
      kind: "Guaranteed";
      value: T;
    }
  | {
      kind: "Predicted";
      value: T;
      instructionIndex: number;
    };

export type DecimalSource = Source<Decimal>;
export type NonFungibleLocalIdArraySource = Source<string[]>;

export interface FeeLocks {
  lock: Decimal;
  contingentLock: Decimal;
}

export interface FeeSummary {
  networkFee: Decimal;
  royaltyFee: Decimal;
}
