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

import { describe, expect, test } from "vitest";
import { Instruction, ManifestAstValue } from "../../src";
import { deserialize, serialize } from "../../src/utils";

describe.each([
  {
    expectedObject: new Instruction.CallFunction(
      new ManifestAstValue.Address(
        "package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"
      ),
      new ManifestAstValue.String("Faucet"),
      new ManifestAstValue.String("new"),
      [new ManifestAstValue.Decimal(BigInt(1))]
    ),
    expectedSerialization: `{"instruction":"CALL_FUNCTION","package_address":{"type":"Address","address":"package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"},"blueprint_name":{"type":"String","value":"Faucet"},"function_name":{"type":"String","value":"new"},"arguments":[{"type":"Decimal","value":"1"}]}`,
  },
  {
    expectedObject: new Instruction.CallMethod(
      new ManifestAstValue.Address(
        "component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"
      ),
      new ManifestAstValue.String("free"),
      [new ManifestAstValue.Decimal(BigInt(1))]
    ),
    expectedSerialization: `{"instruction":"CALL_METHOD","component_address":{"type":"Address","address":"component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"},"method_name":{"type":"String","value":"free"},"arguments":[{"type":"Decimal","value":"1"}]}`,
  },
  {
    expectedObject: new Instruction.CallMethod(
      new ManifestAstValue.Address(
        "component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"
      ),
      new ManifestAstValue.String("free"),
      null
    ),
    expectedSerialization: `{"instruction":"CALL_METHOD","component_address":{"type":"Address","address":"component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"},"method_name":{"type":"String","value":"free"},"arguments":null}`,
  },
  {
    expectedObject: new Instruction.TakeFromWorktop(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
      ),
      new ManifestAstValue.Bucket(new ManifestAstValue.String("ident"))
    ),
    expectedSerialization: `{"instruction":"TAKE_FROM_WORKTOP","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"},"into_bucket":{"type":"Bucket","identifier":{"type":"String","value":"ident"}}}`,
  },
  {
    expectedObject: new Instruction.TakeFromWorktopByAmount(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
      ),
      new ManifestAstValue.Decimal(BigInt("1")),
      new ManifestAstValue.Bucket(new ManifestAstValue.String("ident"))
    ),
    expectedSerialization: `{"instruction":"TAKE_FROM_WORKTOP_BY_AMOUNT","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"},"amount":{"type":"Decimal","value":"1"},"into_bucket":{"type":"Bucket","identifier":{"type":"String","value":"ident"}}}`,
  },
  {
    expectedObject: new Instruction.TakeFromWorktopByIds(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
      ),
      [
        new ManifestAstValue.NonFungibleLocalId(
          new ManifestAstValue.Integer(1)
        ),
      ],
      new ManifestAstValue.Bucket(new ManifestAstValue.String("ident"))
    ),
    expectedSerialization: `{"instruction":"TAKE_FROM_WORKTOP_BY_IDS","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"},"ids":[{"type":"NonFungibleLocalId","value":{"type":"Integer","value":"1"}}],"into_bucket":{"type":"Bucket","identifier":{"type":"String","value":"ident"}}}`,
  },
  {
    expectedObject: new Instruction.ReturnToWorktop(
      new ManifestAstValue.Bucket(new ManifestAstValue.String("ident"))
    ),
    expectedSerialization: `{"instruction":"RETURN_TO_WORKTOP","bucket":{"type":"Bucket","identifier":{"type":"String","value":"ident"}}}`,
  },
  {
    expectedObject: new Instruction.AssertWorktopContains(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
      )
    ),
    expectedSerialization: `{"instruction":"ASSERT_WORKTOP_CONTAINS","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"}}`,
  },
  {
    expectedObject: new Instruction.AssertWorktopContainsByAmount(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
      ),
      new ManifestAstValue.Decimal(BigInt(1))
    ),
    expectedSerialization: `{"instruction":"ASSERT_WORKTOP_CONTAINS_BY_AMOUNT","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"},"amount":{"type":"Decimal","value":"1"}}`,
  },
  {
    expectedObject: new Instruction.AssertWorktopContainsByIds(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
      ),
      [new ManifestAstValue.NonFungibleLocalId(new ManifestAstValue.Integer(1))]
    ),
    expectedSerialization: `{"instruction":"ASSERT_WORKTOP_CONTAINS_BY_IDS","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"},"ids":[{"type":"NonFungibleLocalId","value":{"type":"Integer","value":"1"}}]}`,
  },
  {
    expectedObject: new Instruction.PopFromAuthZone(
      new ManifestAstValue.Proof(new ManifestAstValue.String("ident"))
    ),
    expectedSerialization: `{"instruction":"POP_FROM_AUTH_ZONE","into_proof":{"type":"Proof","identifier":{"type":"String","value":"ident"}}}`,
  },
  {
    expectedObject: new Instruction.PushToAuthZone(
      new ManifestAstValue.Proof(new ManifestAstValue.String("ident"))
    ),
    expectedSerialization: `{"instruction":"PUSH_TO_AUTH_ZONE","proof":{"type":"Proof","identifier":{"type":"String","value":"ident"}}}`,
  },
  {
    expectedObject: new Instruction.CreateProofFromAuthZone(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
      ),
      new ManifestAstValue.Proof(new ManifestAstValue.String("ident"))
    ),
    expectedSerialization: `{"instruction":"CREATE_PROOF_FROM_AUTH_ZONE","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"},"into_proof":{"type":"Proof","identifier":{"type":"String","value":"ident"}}}`,
  },
  {
    expectedObject: new Instruction.CreateProofFromAuthZoneByAmount(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
      ),
      new ManifestAstValue.Decimal(BigInt(1)),
      new ManifestAstValue.Proof(new ManifestAstValue.String("ident"))
    ),
    expectedSerialization: `{"instruction":"CREATE_PROOF_FROM_AUTH_ZONE_BY_AMOUNT","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"},"amount":{"type":"Decimal","value":"1"},"into_proof":{"type":"Proof","identifier":{"type":"String","value":"ident"}}}`,
  },
  {
    expectedObject: new Instruction.CreateProofFromAuthZoneByIds(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
      ),
      [
        new ManifestAstValue.NonFungibleLocalId(
          new ManifestAstValue.Integer(1)
        ),
      ],
      new ManifestAstValue.Proof(new ManifestAstValue.String("ident"))
    ),
    expectedSerialization: `{"instruction":"CREATE_PROOF_FROM_AUTH_ZONE_BY_IDS","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"},"ids":[{"type":"NonFungibleLocalId","value":{"type":"Integer","value":"1"}}],"into_proof":{"type":"Proof","identifier":{"type":"String","value":"ident"}}}`,
  },
  {
    expectedObject: new Instruction.CreateProofFromBucket(
      new ManifestAstValue.Bucket(new ManifestAstValue.String("bucket")),
      new ManifestAstValue.Proof(new ManifestAstValue.String("Proof"))
    ),
    expectedSerialization: `{"instruction":"CREATE_PROOF_FROM_BUCKET","bucket":{"type":"Bucket","identifier":{"type":"String","value":"bucket"}},"into_proof":{"type":"Proof","identifier":{"type":"String","value":"Proof"}}}`,
  },
  {
    expectedObject: new Instruction.CloneProof(
      new ManifestAstValue.Proof(new ManifestAstValue.String("ident")),
      new ManifestAstValue.Proof(new ManifestAstValue.String("ident2"))
    ),
    expectedSerialization: `{"instruction":"CLONE_PROOF","proof":{"type":"Proof","identifier":{"type":"String","value":"ident"}},"into_proof":{"type":"Proof","identifier":{"type":"String","value":"ident2"}}}`,
  },
  {
    expectedObject: new Instruction.DropProof(
      new ManifestAstValue.Proof(new ManifestAstValue.String("proof"))
    ),
    expectedSerialization: `{"instruction":"DROP_PROOF","proof":{"type":"Proof","identifier":{"type":"String","value":"proof"}}}`,
  },
  {
    expectedObject: new Instruction.ClearAuthZone(),
    expectedSerialization: `{"instruction":"CLEAR_AUTH_ZONE"}`,
  },
  {
    expectedObject: new Instruction.ClearSignatureProofs(),
    expectedSerialization: `{"instruction":"CLEAR_SIGNATURE_PROOFS"}`,
  },
  {
    expectedObject: new Instruction.DropAllProofs(),
    expectedSerialization: `{"instruction":"DROP_ALL_PROOFS"}`,
  },
  {
    expectedObject: new Instruction.BurnResource(
      new ManifestAstValue.Bucket(new ManifestAstValue.String("ident"))
    ),
    expectedSerialization: `{"instruction":"BURN_RESOURCE","bucket":{"type":"Bucket","identifier":{"type":"String","value":"ident"}}}`,
  },
  {
    expectedObject: new Instruction.RecallResource(
      new ManifestAstValue.Bytes(
        new Uint8Array([
          169, 213, 84, 116, 196, 254, 155, 4, 165, 243, 157, 200, 22, 75, 154,
          156, 34, 218, 230, 106, 52, 225, 65, 113, 98, 195, 39, 145, 44, 196,
          146,
        ])
      ),
      new ManifestAstValue.Decimal(BigInt(1))
    ),
    expectedSerialization: `{"instruction":"RECALL_RESOURCE","vault_id":{"type":"Bytes","value":"a9d55474c4fe9b04a5f39dc8164b9a9c22dae66a34e1417162c327912cc492"},"amount":{"type":"Decimal","value":"1"}}`,
  },
  {
    expectedObject: new Instruction.SetMetadata(
      new ManifestAstValue.Address(
        "component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"
      ),
      new ManifestAstValue.String("name"),
      new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0), [
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0), [
          new ManifestAstValue.String("deadbeef"),
        ]),
      ])
    ),
    expectedSerialization: `{"instruction":"SET_METADATA","entity_address":{"type":"Address","address":"component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"},"key":{"type":"String","value":"name"},"value":{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"type":"String","value":"deadbeef"}]}]}}`,
  },
  {
    expectedObject: new Instruction.RemoveMetadata(
      new ManifestAstValue.Address(
        "component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"
      ),
      new ManifestAstValue.String("name")
    ),
    expectedSerialization: `{"instruction":"REMOVE_METADATA","entity_address":{"type":"Address","address":"component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"},"key":{"type":"String","value":"name"}}`,
  },
  {
    expectedObject: new Instruction.SetPackageRoyaltyConfig(
      new ManifestAstValue.Address(
        "package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.String,
        ManifestAstValue.Kind.Tuple,
        []
      )
    ),
    expectedSerialization: `{"instruction":"SET_PACKAGE_ROYALTY_CONFIG","package_address":{"type":"Address","address":"package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"},"royalty_config":{"type":"Map","key_value_kind":"String","value_value_kind":"Tuple","entries":[]}}`,
  },
  {
    expectedObject: new Instruction.SetComponentRoyaltyConfig(
      new ManifestAstValue.Address(
        "component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"
      ),
      new ManifestAstValue.Tuple([
        new ManifestAstValue.Map(
          ManifestAstValue.Kind.String,
          ManifestAstValue.Kind.U32,
          []
        ),
        new ManifestAstValue.U32(1),
      ])
    ),
    expectedSerialization: `{"instruction":"SET_COMPONENT_ROYALTY_CONFIG","component_address":{"type":"Address","address":"component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"},"royalty_config":{"type":"Tuple","elements":[{"type":"Map","key_value_kind":"String","value_value_kind":"U32","entries":[]},{"type":"U32","value":"1"}]}}`,
  },
  {
    expectedObject: new Instruction.ClaimPackageRoyalty(
      new ManifestAstValue.Address(
        "package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"
      )
    ),
    expectedSerialization: `{"instruction":"CLAIM_PACKAGE_ROYALTY","package_address":{"type":"Address","address":"package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"}}`,
  },
  {
    expectedObject: new Instruction.ClaimComponentRoyalty(
      new ManifestAstValue.Address(
        "component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"
      )
    ),
    expectedSerialization: `{"instruction":"CLAIM_COMPONENT_ROYALTY","component_address":{"type":"Address","address":"component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"}}`,
  },
  {
    expectedObject: new Instruction.MintFungible(
      new ManifestAstValue.Address(
        "resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz8qety"
      ),
      new ManifestAstValue.Decimal(BigInt(1))
    ),
    expectedSerialization: `{"instruction":"MINT_FUNGIBLE","resource_address":{"type":"Address","address":"resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz8qety"},"amount":{"type":"Decimal","value":"1"}}`,
  },
  {
    expectedObject: new Instruction.MintNonFungible(
      new ManifestAstValue.Address(
        "resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz8qety"
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.NonFungibleLocalId,
        ManifestAstValue.Kind.Tuple,
        []
      )
    ),
    expectedSerialization: `{"instruction":"MINT_NON_FUNGIBLE","resource_address":{"type":"Address","address":"resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz8qety"},"entries":{"type":"Map","key_value_kind":"NonFungibleLocalId","value_value_kind":"Tuple","entries":[]}}`,
  },
  {
    expectedObject: new Instruction.CreateFungibleResource(
      new ManifestAstValue.U8(18),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.String,
        ManifestAstValue.Kind.String,
        []
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.Enum,
        ManifestAstValue.Kind.Tuple,
        []
      )
    ),
    expectedSerialization: `{"instruction":"CREATE_FUNGIBLE_RESOURCE","divisibility":{"type":"U8","value":"18"},"metadata":{"type":"Map","key_value_kind":"String","value_value_kind":"String","entries":[]},"access_rules":{"type":"Map","key_value_kind":"Enum","value_value_kind":"Tuple","entries":[]}}`,
  },
  {
    expectedObject: new Instruction.CreateFungibleResourceWithInitialSupply(
      new ManifestAstValue.U8(18),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.String,
        ManifestAstValue.Kind.String,
        []
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.Enum,
        ManifestAstValue.Kind.Tuple,
        []
      ),
      new ManifestAstValue.Decimal(BigInt(1))
    ),
    expectedSerialization: `{"instruction":"CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY","divisibility":{"type":"U8","value":"18"},"metadata":{"type":"Map","key_value_kind":"String","value_value_kind":"String","entries":[]},"access_rules":{"type":"Map","key_value_kind":"Enum","value_value_kind":"Tuple","entries":[]},"initial_supply":{"type":"Decimal","value":"1"}}`,
  },
  {
    expectedObject: new Instruction.CreateIdentity(
      new ManifestAstValue.Enum(
        new ManifestAstValue.EnumU8Discriminator(0),
        undefined
      )
    ),
    expectedSerialization: `{"instruction":"CREATE_IDENTITY","access_rule":{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}}`,
  },
  {
    expectedObject: new Instruction.CreateValidator(
      new ManifestAstValue.Bytes(
        new Uint8Array([
          2, 121, 190, 102, 126, 249, 220, 187, 172, 85, 160, 98, 149, 206, 135,
          11, 7, 2, 155, 252, 219, 45, 206, 40, 217, 89, 242, 129, 91, 22, 248,
          23, 152,
        ])
      ),
      new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0))
    ),
    expectedSerialization: `{"instruction":"CREATE_VALIDATOR","key":{"type":"Bytes","value":"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"},"owner_access_rule":{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}}`,
  },
  {
    expectedObject: new Instruction.CreateIdentity(
      new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0))
    ),
    expectedSerialization: `{"instruction":"CREATE_IDENTITY","access_rule":{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}}`,
  },
  {
    expectedObject: new Instruction.AssertAccessRule(
      new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0))
    ),
    expectedSerialization: `{"instruction":"ASSERT_ACCESS_RULE","access_rule":{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}}`,
  },
  {
    expectedObject: new Instruction.CreateAccount(
      new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0))
    ),
    expectedSerialization: `{"instruction":"CREATE_ACCOUNT","withdraw_rule":{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}}`,
  },
  {
    expectedObject: new Instruction.CreateAccessController(
      new ManifestAstValue.Bucket(new ManifestAstValue.String("ident")),
      new ManifestAstValue.Tuple([
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0)),
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0)),
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0)),
      ]),
      new ManifestAstValue.Some(new ManifestAstValue.U32(1))
    ),
    expectedSerialization: `{"instruction":"CREATE_ACCESS_CONTROLLER","controlled_asset":{"type":"Bucket","identifier":{"type":"String","value":"ident"}},"rule_set":{"type":"Tuple","elements":[{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}]},"timed_recovery_delay_in_minutes":{"type":"Some","value":{"type":"U32","value":"1"}}}`,
  },
  {
    expectedObject: new Instruction.SetMethodAccessRule(
      new ManifestAstValue.Address(
        "component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"
      ),
      new ManifestAstValue.Tuple([
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0)),
        new ManifestAstValue.String("free"),
      ]),
      new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0))
    ),
    expectedSerialization: `{"instruction":"SET_METHOD_ACCESS_RULE","entity_address":{"type":"Address","address":"component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"},"key":{"type":"Tuple","elements":[{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},{"type":"String","value":"free"}]},"rule":{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}}`,
  },
  {
    expectedObject: new Instruction.MintUuidNonFungible(
      new ManifestAstValue.Address(
        "resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz8qety"
      ),
      new ManifestAstValue.Array(ManifestAstValue.Kind.Tuple, [
        new ManifestAstValue.Tuple([
          new ManifestAstValue.Tuple([]),
          new ManifestAstValue.Tuple([]),
        ]),
        new ManifestAstValue.Tuple([
          new ManifestAstValue.Tuple([]),
          new ManifestAstValue.Tuple([]),
        ]),
      ])
    ),
    expectedSerialization: `{"instruction":"MINT_UUID_NON_FUNGIBLE","resource_address":{"type":"Address","address":"resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz8qety"},"entries":{"type":"Array","element_kind":"Tuple","elements":[{"type":"Tuple","elements":[{"type":"Tuple","elements":[]},{"type":"Tuple","elements":[]}]},{"type":"Tuple","elements":[{"type":"Tuple","elements":[]},{"type":"Tuple","elements":[]}]}]}}`,
  },
  {
    expectedObject: new Instruction.CreateNonFungibleResource(
      new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0)),
      new ManifestAstValue.Tuple([
        new ManifestAstValue.Tuple([
          new ManifestAstValue.Array(ManifestAstValue.Kind.Enum, []),
          new ManifestAstValue.Array(ManifestAstValue.Kind.Tuple, []),
          new ManifestAstValue.Array(ManifestAstValue.Kind.Enum, []),
        ]),
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0), [
          new ManifestAstValue.U8(64),
        ]),
        new ManifestAstValue.Array(ManifestAstValue.Kind.String, []),
      ]),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.String,
        ManifestAstValue.Kind.String,
        []
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.Enum,
        ManifestAstValue.Kind.Tuple,
        []
      )
    ),
    expectedSerialization: `{"instruction":"CREATE_NON_FUNGIBLE_RESOURCE","id_type":{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},"schema":{"type":"Tuple","elements":[{"type":"Tuple","elements":[{"type":"Array","element_kind":"Enum","elements":[]},{"type":"Array","element_kind":"Tuple","elements":[]},{"type":"Array","element_kind":"Enum","elements":[]}]},{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"type":"U8","value":"64"}]},{"type":"Array","element_kind":"String","elements":[]}]},"metadata":{"type":"Map","key_value_kind":"String","value_value_kind":"String","entries":[]},"access_rules":{"type":"Map","key_value_kind":"Enum","value_value_kind":"Tuple","entries":[]}}`,
  },
  {
    expectedObject: new Instruction.PublishPackage(
      new ManifestAstValue.Blob(
        new Uint8Array([
          1, 186, 71, 25, 200, 11, 111, 233, 17, 176, 145, 167, 192, 81, 36,
          182, 78, 238, 206, 150, 78, 9, 192, 88, 239, 143, 152, 5, 218, 202,
          84, 107,
        ])
      ),
      new ManifestAstValue.Blob(
        new Uint8Array([
          1, 186, 71, 25, 200, 11, 111, 233, 17, 176, 145, 167, 192, 81, 36,
          182, 78, 238, 206, 150, 78, 9, 192, 88, 239, 143, 152, 5, 218, 202,
          84, 107,
        ])
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.String,
        ManifestAstValue.Kind.Tuple,
        []
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.String,
        ManifestAstValue.Kind.String,
        []
      ),
      new ManifestAstValue.Tuple([
        new ManifestAstValue.Map(
          ManifestAstValue.Kind.Tuple,
          ManifestAstValue.Kind.Enum,
          []
        ),
        new ManifestAstValue.Map(
          ManifestAstValue.Kind.String,
          ManifestAstValue.Kind.Enum,
          []
        ),
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0)),
        new ManifestAstValue.Map(
          ManifestAstValue.Kind.Tuple,
          ManifestAstValue.Kind.Enum,
          []
        ),
        new ManifestAstValue.Map(
          ManifestAstValue.Kind.String,
          ManifestAstValue.Kind.Enum,
          []
        ),
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0)),
      ])
    ),
    expectedSerialization: `{"instruction":"PUBLISH_PACKAGE","code":{"type":"Blob","hash":"01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b"},"schema":{"type":"Blob","hash":"01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b"},"royalty_config":{"type":"Map","key_value_kind":"String","value_value_kind":"Tuple","entries":[]},"metadata":{"type":"Map","key_value_kind":"String","value_value_kind":"String","entries":[]},"access_rules":{"type":"Tuple","elements":[{"type":"Map","key_value_kind":"Tuple","value_value_kind":"Enum","entries":[]},{"type":"Map","key_value_kind":"String","value_value_kind":"Enum","entries":[]},{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},{"type":"Map","key_value_kind":"Tuple","value_value_kind":"Enum","entries":[]},{"type":"Map","key_value_kind":"String","value_value_kind":"Enum","entries":[]},{"type":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}]}}`,
  },
])(
  "Serialization test for $expectedSerialization",
  ({ expectedObject, expectedSerialization }) => {
    test(`${expectedObject} is serialized as expected`, () => {
      // Act
      let actualSerialization = serialize(expectedObject);

      // Assert
      expect(actualSerialization).toEqual(expectedSerialization);
    });

    test(`${expectedSerialization} is deserialized as expected`, () => {
      // Act
      let actualObject = deserialize(
        expectedSerialization,
        // @ts-ignore
        expectedObject.constructor
      );

      // Assert
      expect(actualObject).toEqual(expectedObject);
    });
  }
);
