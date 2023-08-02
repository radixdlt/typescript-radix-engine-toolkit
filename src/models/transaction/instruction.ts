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
import { ManifestAddress, Value } from "../../";

export type Instruction =
  | {
      kind: "TakeAllFromWorktop";
      resourceAddress: string;
    }
  | {
      kind: "TakeFromWorktop";
      resourceAddress: string;
      amount: Decimal;
    }
  | {
      kind: "TakeNonFungiblesFromWorktop";
      resourceAddress: string;
      ids: string[];
    }
  | {
      kind: "ReturnToWorktop";
      bucketId: number;
    }
  | {
      kind: "AssertWorktopContainsAny";
      resourceAddress: string;
    }
  | {
      kind: "AssertWorktopContains";
      resourceAddress: string;
      amount: Decimal;
    }
  | {
      kind: "AssertWorktopContainsNonFungibles";
      resourceAddress: string;
      ids: string[];
    }
  | { kind: "PopFromAuthZone" }
  | {
      kind: "PushToAuthZone";
      proofId: number;
    }
  | { kind: "DropAuthZoneProofs" }
  | {
      kind: "CreateProofFromAuthZoneOfAmount";
      resourceAddress: string;
      amount: Decimal;
    }
  | {
      kind: "CreateProofFromAuthZoneOfNonFungibles";
      resourceAddress: string;
      ids: string[];
    }
  | {
      kind: "CreateProofFromAuthZoneOfAll";
      resourceAddress: string;
    }
  | { kind: "DropNamedProofs" }
  | { kind: "DropAuthZoneRegularProofs" }
  | { kind: "DropAuthZoneSignatureProofs" }
  | {
      kind: "CreateProofFromBucketOfAmount";
      bucketId: number;
      amount: Decimal;
    }
  | {
      kind: "CreateProofFromBucketOfNonFungibles";
      bucketId: number;
      ids: string[];
    }
  | {
      kind: "CreateProofFromBucketOfAll";
      bucketId: number;
    }
  | {
      kind: "BurnResource";
      bucketId: number;
    }
  | {
      kind: "CloneProof";
      proofId: number;
    }
  | {
      kind: "DropProof";
      proofId: number;
    }
  | {
      kind: "CallFunction";
      packageAddress: ManifestAddress;
      blueprintName: string;
      functionName: string;
      args: Value;
    }
  | {
      kind: "CallMethod";
      address: ManifestAddress;
      methodName: string;
      args: Value;
    }
  | {
      kind: "CallRoyaltyMethod";
      address: ManifestAddress;
      methodName: string;
      args: Value;
    }
  | {
      kind: "CallMetadataMethod";
      address: ManifestAddress;
      methodName: string;
      args: Value;
    }
  | {
      kind: "CallRoleAssignmentMethod";
      address: ManifestAddress;
      methodName: string;
      args: Value;
    }
  | {
      kind: "CallDirectVaultMethod";
      address: string;
      methodName: string;
      args: Value;
    }
  | { kind: "DropAllProofs" }
  | {
      kind: "AllocateGlobalAddress";
      packageAddress: string;
      blueprintName: string;
    };
