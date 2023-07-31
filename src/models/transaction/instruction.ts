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
      resource_address: string;
    }
  | {
      kind: "TakeFromWorktop";
      resource_address: string;
      amount: Decimal;
    }
  | {
      kind: "TakeNonFungiblesFromWorktop";
      resource_address: string;
      ids: string[];
    }
  | {
      kind: "ReturnToWorktop";
      bucket_id: number;
    }
  | {
      kind: "AssertWorktopContainsAny";
      resource_address: string;
    }
  | {
      kind: "AssertWorktopContains";
      resource_address: string;
      amount: Decimal;
    }
  | {
      kind: "AssertWorktopContainsNonFungibles";
      resource_address: string;
      ids: string[];
    }
  | { kind: "PopFromAuthZone" }
  | {
      kind: "PushToAuthZone";
      proof_id: number;
    }
  | { kind: "ClearAuthZone" }
  | {
      kind: "CreateProofFromAuthZoneOfAmount";
      resource_address: string;
      amount: Decimal;
    }
  | {
      kind: "CreateProofFromAuthZoneOfNonFungibles";
      resource_address: string;
      ids: string[];
    }
  | {
      kind: "CreateProofFromAuthZoneOfAll";
      resource_address: string;
    }
  | { kind: "ClearSignatureProofs" }
  | {
      kind: "CreateProofFromBucketOfAmount";
      bucket_id: number;
      amount: Decimal;
    }
  | {
      kind: "CreateProofFromBucketOfNonFungibles";
      bucket_id: number;
      ids: string[];
    }
  | {
      kind: "CreateProofFromBucketOfAll";
      bucket_id: number;
    }
  | {
      kind: "BurnResource";
      bucket_id: number;
    }
  | {
      kind: "CloneProof";
      proof_id: number;
    }
  | {
      kind: "DropProof";
      proof_id: number;
    }
  | {
      kind: "CallFunction";
      package_address: ManifestAddress;
      blueprint_name: string;
      function_name: string;
      args: Value;
    }
  | {
      kind: "CallMethod";
      address: ManifestAddress;
      method_name: string;
      args: Value;
    }
  | {
      kind: "CallRoyaltyMethod";
      address: ManifestAddress;
      method_name: string;
      args: Value;
    }
  | {
      kind: "CallMetadataMethod";
      address: ManifestAddress;
      method_name: string;
      args: Value;
    }
  | {
      kind: "CallRoleAssignmentMethod";
      address: ManifestAddress;
      method_name: string;
      args: Value;
    }
  | {
      kind: "CallDirectVaultMethod";
      address: string;
      method_name: string;
      args: Value;
    }
  | { kind: "DropAllProofs" }
  | {
      kind: "AllocateGlobalAddress";
      package_address: string;
      blueprint_name: string;
    };
