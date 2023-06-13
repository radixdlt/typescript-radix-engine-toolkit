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
import {
  CreateProofFromAuthZoneOfAll,
  SetAuthorityMutability,
} from "../../src/models/transaction/instruction";
import { EnumU8Discriminator } from "../../src/models/value/manifest_ast";
import { deserialize, serialize } from "../../src/utils";
import { assertSerializationEquals } from "../test_utils";

const Kind = ManifestAstValue.Kind;
const Bool = ManifestAstValue.Bool;
const U8 = ManifestAstValue.U8;
const U16 = ManifestAstValue.U16;
const U32 = ManifestAstValue.U32;
const U64 = ManifestAstValue.U64;
const U128 = ManifestAstValue.U128;
const I8 = ManifestAstValue.I8;
const I16 = ManifestAstValue.I16;
const I32 = ManifestAstValue.I32;
const I64 = ManifestAstValue.I64;
const I128 = ManifestAstValue.I128;
const String = ManifestAstValue.String;
const Enum = ManifestAstValue.Enum;
const Some = ManifestAstValue.Some;
const None = ManifestAstValue.None;
const Ok = ManifestAstValue.Ok;
const Err = ManifestAstValue.Err;
const Array = ManifestAstValue.Array;
const Map = ManifestAstValue.Map;
const Tuple = ManifestAstValue.Tuple;
const Decimal = ManifestAstValue.Decimal;
const PreciseDecimal = ManifestAstValue.PreciseDecimal;
const Address = ManifestAstValue.Address;
const Bucket = ManifestAstValue.Bucket;
const Proof = ManifestAstValue.Proof;
const NonFungibleLocalId = ManifestAstValue.NonFungibleLocalId;
const NonFungibleGlobalId = ManifestAstValue.NonFungibleGlobalId;
const Expression = ManifestAstValue.Expression;
const Blob = ManifestAstValue.Blob;
const Bytes = ManifestAstValue.Bytes;
const CallFunction = Instruction.CallFunction;
const CallMethod = Instruction.CallMethod;
const TakeAllFromWorktop = Instruction.TakeAllFromWorktop;
const TakeFromWorktop = Instruction.TakeFromWorktop;
const TakeNonFungiblesFromWorktop = Instruction.TakeNonFungiblesFromWorktop;
const ReturnToWorktop = Instruction.ReturnToWorktop;
const AssertWorktopContains = Instruction.AssertWorktopContains;
const AssertWorktopContainsNonFungibles =
  Instruction.AssertWorktopContainsNonFungibles;
const PopFromAuthZone = Instruction.PopFromAuthZone;
const PushToAuthZone = Instruction.PushToAuthZone;
const ClearAuthZone = Instruction.ClearAuthZone;
const ClearSignatureProofs = Instruction.ClearSignatureProofs;
const CreateProofFromAuthZone = Instruction.CreateProofFromAuthZone;
const CreateProofFromAuthZoneOfAmount =
  Instruction.CreateProofFromAuthZoneOfAmount;
const CreateProofFromAuthZoneOfNonFungibles =
  Instruction.CreateProofFromAuthZoneOfNonFungibles;
const CreateProofFromBucket = Instruction.CreateProofFromBucket;
const CloneProof = Instruction.CloneProof;
const DropProof = Instruction.DropProof;
const DropAllProofs = Instruction.DropAllProofs;
const PublishPackage = Instruction.PublishPackage;
const PublishPackageAdvanced = Instruction.PublishPackageAdvanced;
const BurnResource = Instruction.BurnResource;
const RecallResource = Instruction.RecallResource;
const SetMetadata = Instruction.SetMetadata;
const RemoveMetadata = Instruction.RemoveMetadata;
const SetPackageRoyaltyConfig = Instruction.SetPackageRoyaltyConfig;
const SetComponentRoyaltyConfig = Instruction.SetComponentRoyaltyConfig;
const ClaimPackageRoyalty = Instruction.ClaimPackageRoyalty;
const ClaimComponentRoyalty = Instruction.ClaimComponentRoyalty;
const SetAuthorityAccessRule = Instruction.SetAuthorityAccessRule;
const MintFungible = Instruction.MintFungible;
const MintNonFungible = Instruction.MintNonFungible;
const MintUuidNonFungible = Instruction.MintUuidNonFungible;
const CreateFungibleResource = Instruction.CreateFungibleResource;
const CreateFungibleResourceWithInitialSupply =
  Instruction.CreateFungibleResourceWithInitialSupply;
const CreateNonFungibleResource = Instruction.CreateNonFungibleResource;
const CreateNonFungibleResourceWithInitialSupply =
  Instruction.CreateNonFungibleResourceWithInitialSupply;
const CreateAccessController = Instruction.CreateAccessController;
const CreateIdentity = Instruction.CreateIdentity;
const CreateIdentityAdvanced = Instruction.CreateIdentityAdvanced;
const CreateValidator = Instruction.CreateValidator;
const CreateAccount = Instruction.CreateAccount;
const CreateAccountAdvanced = Instruction.CreateAccountAdvanced;

describe.each([
  {
    expectedObject: new CallFunction(
      new Address(
        "package_rdx1pkgxxxxxxxxxfaucetxxxxxxxxx000034355863xxxxxxxxxfaucet"
      ),
      new String("Faucet"),
      new String("new"),
      [new Decimal("1")]
    ),
    expectedSerialization: `{"instruction":"CALL_FUNCTION","package_address":{"kind":"Address","value":"package_rdx1pkgxxxxxxxxxfaucetxxxxxxxxx000034355863xxxxxxxxxfaucet"},"blueprint_name":{"kind":"String","value":"Faucet"},"function_name":{"kind":"String","value":"new"},"arguments":[{"kind":"Decimal","value":"1"}]}`,
  },
  {
    expectedObject: new CallMethod(
      new Address(
        "component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"
      ),
      new String("free"),
      [new Decimal("1")]
    ),
    expectedSerialization: `{"instruction":"CALL_METHOD","component_address":{"kind":"Address","value":"component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"},"method_name":{"kind":"String","value":"free"},"arguments":[{"kind":"Decimal","value":"1"}]}`,
  },
  {
    expectedObject: new CallMethod(
      new Address(
        "component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"
      ),
      new String("free"),
      []
    ),
    expectedSerialization: `{"instruction":"CALL_METHOD","component_address":{"kind":"Address","value":"component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"},"method_name":{"kind":"String","value":"free"},"arguments":[]}`,
  },
  {
    expectedObject: new TakeAllFromWorktop(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      new Bucket("ident")
    ),
    expectedSerialization: `{"instruction":"TAKE_ALL_FROM_WORKTOP","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"into_bucket":{"kind":"Bucket","value":"ident"}}`,
  },
  {
    expectedObject: new TakeFromWorktop(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      new Decimal("1"),
      new Bucket("ident")
    ),
    expectedSerialization: `{"instruction":"TAKE_FROM_WORKTOP","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"amount":{"kind":"Decimal","value":"1"},"into_bucket":{"kind":"Bucket","value":"ident"}}`,
  },
  {
    expectedObject: new TakeNonFungiblesFromWorktop(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      [new NonFungibleLocalId("#1#")],
      new Bucket("ident")
    ),
    expectedSerialization: `{"instruction":"TAKE_NON_FUNGIBLES_FROM_WORKTOP","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"ids":[{"kind":"NonFungibleLocalId","value":"#1#"}],"into_bucket":{"kind":"Bucket","value":"ident"}}`,
  },
  {
    expectedObject: new ReturnToWorktop(new Bucket("ident")),
    expectedSerialization: `{"instruction":"RETURN_TO_WORKTOP","bucket":{"kind":"Bucket","value":"ident"}}`,
  },
  {
    expectedObject: new AssertWorktopContains(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      new Decimal("1")
    ),
    expectedSerialization: `{"instruction":"ASSERT_WORKTOP_CONTAINS","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"amount":{"kind":"Decimal","value":"1"}}`,
  },
  {
    expectedObject: new AssertWorktopContainsNonFungibles(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      [new NonFungibleLocalId("#1#")]
    ),
    expectedSerialization: `{"instruction":"ASSERT_WORKTOP_CONTAINS_NON_FUNGIBLES","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"ids":[{"kind":"NonFungibleLocalId","value":"#1#"}]}`,
  },
  {
    expectedObject: new PopFromAuthZone(new Proof("ident")),
    expectedSerialization: `{"instruction":"POP_FROM_AUTH_ZONE","into_proof":{"kind":"Proof","value":"ident"}}`,
  },
  {
    expectedObject: new PushToAuthZone(new Proof("ident")),
    expectedSerialization: `{"instruction":"PUSH_TO_AUTH_ZONE","proof":{"kind":"Proof","value":"ident"}}`,
  },
  {
    expectedObject: new ClearAuthZone(),
    expectedSerialization: `{"instruction":"CLEAR_AUTH_ZONE"}`,
  },
  {
    expectedObject: new CreateProofFromAuthZone(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      new Proof("ident")
    ),
    expectedSerialization: `{"instruction":"CREATE_PROOF_FROM_AUTH_ZONE","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"into_proof":{"kind":"Proof","value":"ident"}}`,
  },
  {
    expectedObject: new CreateProofFromAuthZoneOfAll(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      new Proof("ident")
    ),
    expectedSerialization: `{"instruction":"CREATE_PROOF_FROM_AUTH_ZONE_OF_ALL","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"into_proof":{"kind":"Proof","value":"ident"}}`,
  },
  {
    expectedObject: new CreateProofFromAuthZoneOfAmount(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      new Decimal("1"),
      new Proof("ident")
    ),
    expectedSerialization: `{"instruction":"CREATE_PROOF_FROM_AUTH_ZONE_OF_AMOUNT","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"amount":{"kind":"Decimal","value":"1"},"into_proof":{"kind":"Proof","value":"ident"}}`,
  },
  {
    expectedObject: new CreateProofFromAuthZoneOfNonFungibles(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      [new NonFungibleLocalId("#1#")],
      new Proof("ident")
    ),
    expectedSerialization: `{"instruction":"CREATE_PROOF_FROM_AUTH_ZONE_OF_NON_FUNGIBLES","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"ids":[{"kind":"NonFungibleLocalId","value":"#1#"}],"into_proof":{"kind":"Proof","value":"ident"}}`,
  },
  {
    expectedObject: new CreateProofFromBucket(
      new Bucket("bucket"),
      new Proof("Proof")
    ),
    expectedSerialization: `{"instruction":"CREATE_PROOF_FROM_BUCKET","bucket":{"kind":"Bucket","value":"bucket"},"into_proof":{"kind":"Proof","value":"Proof"}}`,
  },
  {
    expectedObject: new CloneProof(new Proof("ident"), new Proof("ident2")),
    expectedSerialization: `{"instruction":"CLONE_PROOF","proof":{"kind":"Proof","value":"ident"},"into_proof":{"kind":"Proof","value":"ident2"}}`,
  },
  {
    expectedObject: new PublishPackage(
      new Blob(
        "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b"
      ),
      new Bytes("4d2101230c2100"),
      new Map(Kind.String, Kind.Tuple, []),
      new Map(Kind.String, Kind.String, [])
    ),
    expectedSerialization: `{"instruction":"PUBLISH_PACKAGE","code":{"kind":"Blob","value":"01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b"},"schema":{"kind":"Bytes","hex":"4d2101230c2100"},"royalty_config":{"kind":"Map","key_kind":"String","value_kind":"Tuple","entries":[]},"metadata":{"kind":"Map","key_kind":"String","value_kind":"String","entries":[]}}`,
  },
  {
    expectedObject: new PublishPackageAdvanced(
      new Blob(
        "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b"
      ),
      new Bytes("4d2101230c2100"),
      new Map(Kind.String, Kind.Tuple, []),
      new Map(Kind.String, Kind.String, []),
      new Tuple([
        new Map(Kind.Tuple, Kind.Enum, []),
        new Map(Kind.Tuple, Kind.Enum, []),
        new Map(Kind.String, Kind.Enum, []),
        new Enum(new EnumU8Discriminator(0), [
          new Enum(new EnumU8Discriminator(0)),
        ]),
        new Map(Kind.Tuple, Kind.Enum, []),
        new Map(Kind.String, Kind.Enum, []),
        new Enum(new EnumU8Discriminator(0), [
          new Enum(new EnumU8Discriminator(0)),
        ]),
      ])
    ),
    expectedSerialization: `{"instruction":"PUBLISH_PACKAGE_ADVANCED","code":{"kind":"Blob","value":"01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b"},"schema":{"kind":"Bytes","hex":"4d2101230c2100"},"royalty_config":{"kind":"Map","key_kind":"String","value_kind":"Tuple","entries":[]},"metadata":{"kind":"Map","key_kind":"String","value_kind":"String","entries":[]},"authority_rules":{"kind":"Tuple","fields":[{"kind":"Map","key_kind":"Tuple","value_kind":"Enum","entries":[]},{"kind":"Map","key_kind":"Tuple","value_kind":"Enum","entries":[]},{"kind":"Map","key_kind":"String","value_kind":"Enum","entries":[]},{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}]},{"kind":"Map","key_kind":"Tuple","value_kind":"Enum","entries":[]},{"kind":"Map","key_kind":"String","value_kind":"Enum","entries":[]},{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}]}]}}`,
  },
  {
    expectedObject: new BurnResource(new Bucket("ident")),
    expectedSerialization: `{"instruction":"BURN_RESOURCE","bucket":{"kind":"Bucket","value":"ident"}}`,
  },
  {
    expectedObject: new DropProof(new Proof("proof")),
    expectedSerialization: `{"instruction":"DROP_PROOF","proof":{"kind":"Proof","value":"proof"}}`,
  },
  {
    expectedObject: new DropAllProofs(),
    expectedSerialization: `{"instruction":"DROP_ALL_PROOFS"}`,
  },
  {
    expectedObject: new RecallResource(
      new Address(
        "internal_vault_sim1tqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cvevp72ff"
      ),
      new Decimal("1")
    ),
    expectedSerialization: `{"instruction":"RECALL_RESOURCE","vault_id":{"kind":"Address","value":"internal_vault_sim1tqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cvevp72ff"},"amount":{"kind":"Decimal","value":"1"}}`,
  },
  {
    expectedObject: new SetMetadata(
      new Address(
        "component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"
      ),
      new String("name"),
      new Enum(new EnumU8Discriminator(0), [
        new Enum(new EnumU8Discriminator(0), [new String("deadbeef")]),
      ])
    ),
    expectedSerialization: `{"instruction":"SET_METADATA","entity_address":{"kind":"Address","value":"component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"},"key":{"kind":"String","value":"name"},"value":{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"kind":"String","value":"deadbeef"}]}]}}`,
  },
  {
    expectedObject: new RemoveMetadata(
      new Address(
        "component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"
      ),
      new String("name")
    ),
    expectedSerialization: `{"instruction":"REMOVE_METADATA","entity_address":{"kind":"Address","value":"component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"},"key":{"kind":"String","value":"name"}}`,
  },
  {
    expectedObject: new SetPackageRoyaltyConfig(
      new Address(
        "package_rdx1pkgxxxxxxxxxfaucetxxxxxxxxx000034355863xxxxxxxxxfaucet"
      ),
      new Map(Kind.String, Kind.Tuple, [])
    ),
    expectedSerialization: `{"instruction":"SET_PACKAGE_ROYALTY_CONFIG","package_address":{"kind":"Address","value":"package_rdx1pkgxxxxxxxxxfaucetxxxxxxxxx000034355863xxxxxxxxxfaucet"},"royalty_config":{"kind":"Map","key_kind":"String","value_kind":"Tuple","entries":[]}}`,
  },
  {
    expectedObject: new SetComponentRoyaltyConfig(
      new Address(
        "component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"
      ),
      new Tuple([new Map(Kind.String, Kind.U32, []), new U32(1)])
    ),
    expectedSerialization: `{"instruction":"SET_COMPONENT_ROYALTY_CONFIG","component_address":{"kind":"Address","value":"component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"},"royalty_config":{"kind":"Tuple","fields":[{"kind":"Map","key_kind":"String","value_kind":"U32","entries":[]},{"kind":"U32","value":"1"}]}}`,
  },
  {
    expectedObject: new ClaimPackageRoyalty(
      new Address(
        "package_rdx1pkgxxxxxxxxxfaucetxxxxxxxxx000034355863xxxxxxxxxfaucet"
      )
    ),
    expectedSerialization: `{"instruction":"CLAIM_PACKAGE_ROYALTY","package_address":{"kind":"Address","value":"package_rdx1pkgxxxxxxxxxfaucetxxxxxxxxx000034355863xxxxxxxxxfaucet"}}`,
  },
  {
    expectedObject: new ClaimComponentRoyalty(
      new Address(
        "component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"
      )
    ),
    expectedSerialization: `{"instruction":"CLAIM_COMPONENT_ROYALTY","component_address":{"kind":"Address","value":"component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"}}`,
  },
  {
    expectedObject: new SetAuthorityAccessRule(
      new Address(
        "component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"
      ),
      new Enum(new EnumU8Discriminator(0), []),
      new Enum(new EnumU8Discriminator(0), []),
      new Enum(new EnumU8Discriminator(0), [])
    ),
    expectedSerialization: `{"instruction":"SET_AUTHORITY_ACCESS_RULE","entity_address":{"kind":"Address","value":"component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"},"object_key":{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},"authority_key":{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},"rule":{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}}`,
  },
  {
    expectedObject: new SetAuthorityMutability(
      new Address(
        "component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"
      ),
      new Enum(new EnumU8Discriminator(0), []),
      new Enum(new EnumU8Discriminator(0), []),
      new Enum(new EnumU8Discriminator(0), [])
    ),
    expectedSerialization: `{"instruction":"SET_AUTHORITY_MUTABILITY","entity_address":{"kind":"Address","value":"component_rdx1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve90hqtq"},"object_key":{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},"authority_key":{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},"mutability":{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}}`,
  },
  {
    expectedObject: new MintFungible(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      new Decimal("1")
    ),
    expectedSerialization: `{"instruction":"MINT_FUNGIBLE","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"amount":{"kind":"Decimal","value":"1"}}`,
  },
  {
    expectedObject: new MintNonFungible(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      new Map(Kind.NonFungibleLocalId, Kind.Tuple, [])
    ),
    expectedSerialization: `{"instruction":"MINT_NON_FUNGIBLE","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"entries":{"kind":"Map","key_kind":"NonFungibleLocalId","value_kind":"Tuple","entries":[]}}`,
  },
  {
    expectedObject: new MintUuidNonFungible(
      new Address(
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
      ),
      new Array(Kind.Tuple, [
        new Tuple([new Tuple([]), new Tuple([])]),
        new Tuple([new Tuple([]), new Tuple([])]),
      ])
    ),
    expectedSerialization: `{"instruction":"MINT_UUID_NON_FUNGIBLE","resource_address":{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"},"entries":{"kind":"Array","element_kind":"Tuple","elements":[{"kind":"Tuple","fields":[{"kind":"Tuple","fields":[]},{"kind":"Tuple","fields":[]}]},{"kind":"Tuple","fields":[{"kind":"Tuple","fields":[]},{"kind":"Tuple","fields":[]}]}]}}`,
  },
  {
    expectedObject: new CreateFungibleResource(
      new U8(18),
      new Map(Kind.String, Kind.String, []),
      new Map(Kind.Enum, Kind.Tuple, [])
    ),
    expectedSerialization: `{"instruction":"CREATE_FUNGIBLE_RESOURCE","divisibility":{"kind":"U8","value":"18"},"metadata":{"kind":"Map","key_kind":"String","value_kind":"String","entries":[]},"access_rules":{"kind":"Map","key_kind":"Enum","value_kind":"Tuple","entries":[]}}`,
  },
  {
    expectedObject: new CreateFungibleResourceWithInitialSupply(
      new U8(18),
      new Map(Kind.String, Kind.String, []),
      new Map(Kind.Enum, Kind.Tuple, []),
      new Decimal("1")
    ),
    expectedSerialization: `{"instruction":"CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY","divisibility":{"kind":"U8","value":"18"},"metadata":{"kind":"Map","key_kind":"String","value_kind":"String","entries":[]},"access_rules":{"kind":"Map","key_kind":"Enum","value_kind":"Tuple","entries":[]},"initial_supply":{"kind":"Decimal","value":"1"}}`,
  },
  {
    expectedObject: new CreateNonFungibleResource(
      new Enum(new EnumU8Discriminator(0)),
      new Tuple([
        new Tuple([
          new Array(Kind.Enum, []),
          new Array(Kind.Tuple, []),
          new Array(Kind.Enum, []),
        ]),
        new Enum(new EnumU8Discriminator(0), [new U8(64)]),
        new Array(Kind.String, []),
      ]),
      new Map(Kind.String, Kind.String, []),
      new Map(Kind.Enum, Kind.Tuple, [])
    ),
    expectedSerialization: `{"instruction":"CREATE_NON_FUNGIBLE_RESOURCE","id_type":{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},"schema":{"kind":"Tuple","fields":[{"kind":"Tuple","fields":[{"kind":"Array","element_kind":"Enum","elements":[]},{"kind":"Array","element_kind":"Tuple","elements":[]},{"kind":"Array","element_kind":"Enum","elements":[]}]},{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"kind":"U8","value":"64"}]},{"kind":"Array","element_kind":"String","elements":[]}]},"metadata":{"kind":"Map","key_kind":"String","value_kind":"String","entries":[]},"access_rules":{"kind":"Map","key_kind":"Enum","value_kind":"Tuple","entries":[]}}`,
  },
  {
    expectedObject: new CreateAccessController(
      new Bucket("ident"),
      new Tuple([
        new Enum(new EnumU8Discriminator(0), []),
        new Enum(new EnumU8Discriminator(0), []),
        new Enum(new EnumU8Discriminator(0), []),
      ]),
      new Some(new U32(1))
    ),
    expectedSerialization: `{"instruction":"CREATE_ACCESS_CONTROLLER","controlled_asset":{"kind":"Bucket","value":"ident"},"rule_set":{"kind":"Tuple","fields":[{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]},{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}]},"timed_recovery_delay_in_minutes":{"kind":"Some","value":{"kind":"U32","value":"1"}}}`,
  },
  {
    expectedObject: new CreateIdentity(),
    expectedSerialization: `{"instruction":"CREATE_IDENTITY"}`,
  },
  {
    expectedObject: new CreateAccount(),
    expectedSerialization: `{"instruction":"CREATE_ACCOUNT"}`,
  },
  {
    expectedObject: new CreateIdentityAdvanced(
      new Tuple([
        new Map(Kind.Tuple, Kind.Enum, []),
        new Map(Kind.Tuple, Kind.Enum, []),
        new Map(Kind.String, Kind.Enum, []),
        new Enum(new EnumU8Discriminator(0), [
          new Enum(new EnumU8Discriminator(0)),
        ]),
        new Map(Kind.Tuple, Kind.Enum, []),
        new Map(Kind.String, Kind.Enum, []),
        new Enum(new EnumU8Discriminator(0), [
          new Enum(new EnumU8Discriminator(0)),
        ]),
      ])
    ),
    expectedSerialization: `{"instruction":"CREATE_IDENTITY_ADVANCED","config":{"kind":"Tuple","fields":[{"kind":"Map","key_kind":"Tuple","value_kind":"Enum","entries":[]},{"kind":"Map","key_kind":"Tuple","value_kind":"Enum","entries":[]},{"kind":"Map","key_kind":"String","value_kind":"Enum","entries":[]},{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}]},{"kind":"Map","key_kind":"Tuple","value_kind":"Enum","entries":[]},{"kind":"Map","key_kind":"String","value_kind":"Enum","entries":[]},{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}]}]}}`,
  },
  {
    expectedObject: new CreateAccountAdvanced(
      new Tuple([
        new Map(Kind.Tuple, Kind.Enum, []),
        new Map(Kind.Tuple, Kind.Enum, []),
        new Map(Kind.String, Kind.Enum, []),
        new Enum(new EnumU8Discriminator(0), [
          new Enum(new EnumU8Discriminator(0)),
        ]),
        new Map(Kind.Tuple, Kind.Enum, []),
        new Map(Kind.String, Kind.Enum, []),
        new Enum(new EnumU8Discriminator(0), [
          new Enum(new EnumU8Discriminator(0)),
        ]),
      ])
    ),
    expectedSerialization: `{"instruction":"CREATE_ACCOUNT_ADVANCED","config":{"kind":"Tuple","fields":[{"kind":"Map","key_kind":"Tuple","value_kind":"Enum","entries":[]},{"kind":"Map","key_kind":"Tuple","value_kind":"Enum","entries":[]},{"kind":"Map","key_kind":"String","value_kind":"Enum","entries":[]},{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}]},{"kind":"Map","key_kind":"Tuple","value_kind":"Enum","entries":[]},{"kind":"Map","key_kind":"String","value_kind":"Enum","entries":[]},{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[{"kind":"Enum","variant":{"type":"U8","discriminator":"0"},"fields":[]}]}]}}`,
  },
  {
    expectedObject: new CreateValidator(
      new Bytes(
        "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
      )
    ),
    expectedSerialization: `{"instruction":"CREATE_VALIDATOR","key":{"kind":"Bytes","hex":"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"}}`,
  },
  {
    expectedObject: new ClearSignatureProofs(),
    expectedSerialization: `{"instruction":"CLEAR_SIGNATURE_PROOFS"}`,
  },
])(
  "Serialization test for $expectedSerialization",
  ({ expectedObject, expectedSerialization }) => {
    test(`${expectedObject} is serialized as expected`, () => {
      // Act
      const actualSerialization = serialize(expectedObject);

      // Assert
      assertSerializationEquals(actualSerialization, expectedSerialization);
    });

    test(`${expectedSerialization} is deserialized as expected`, () => {
      // Act
      const actualObject = deserialize(
        expectedSerialization,
        // @ts-ignore
        expectedObject.constructor
      );

      // Assert
      expect(actualObject).toEqual(expectedObject);
    });
  }
);
