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

import { Expose, Type, TypeOptions, instanceToPlain } from "class-transformer";
import { ManifestAstValue } from "../../models/value";

export abstract class Instruction {
  readonly instruction: Kind;

  constructor(instruction: Kind) {
    this.instruction = instruction;
  }

  abstract toString(): string;
}

export enum Kind {
  CallFunction = "CALL_FUNCTION",
  CallMethod = "CALL_METHOD",
  TakeFromWorktop = "TAKE_FROM_WORKTOP",
  TakeFromWorktopByAmount = "TAKE_FROM_WORKTOP_BY_AMOUNT",
  TakeFromWorktopByIds = "TAKE_FROM_WORKTOP_BY_IDS",
  ReturnToWorktop = "RETURN_TO_WORKTOP",
  AssertWorktopContains = "ASSERT_WORKTOP_CONTAINS",
  AssertWorktopContainsByAmount = "ASSERT_WORKTOP_CONTAINS_BY_AMOUNT",
  AssertWorktopContainsByIds = "ASSERT_WORKTOP_CONTAINS_BY_IDS",
  PopFromAuthZone = "POP_FROM_AUTH_ZONE",
  PushToAuthZone = "PUSH_TO_AUTH_ZONE",
  ClearAuthZone = "CLEAR_AUTH_ZONE",
  ClearSignatureProofs = "CLEAR_SIGNATURE_PROOFS",
  CreateProofFromAuthZone = "CREATE_PROOF_FROM_AUTH_ZONE",
  CreateProofFromAuthZoneByAmount = "CREATE_PROOF_FROM_AUTH_ZONE_BY_AMOUNT",
  CreateProofFromAuthZoneByIds = "CREATE_PROOF_FROM_AUTH_ZONE_BY_IDS",
  CreateProofFromBucket = "CREATE_PROOF_FROM_BUCKET",
  CloneProof = "CLONE_PROOF",
  DropProof = "DROP_PROOF",
  DropAllProofs = "DROP_ALL_PROOFS",
  PublishPackage = "PUBLISH_PACKAGE",
  BurnResource = "BURN_RESOURCE",
  RecallResource = "RECALL_RESOURCE",
  SetMetadata = "SET_METADATA",
  RemoveMetadata = "REMOVE_METADATA",
  SetPackageRoyaltyConfig = "SET_PACKAGE_ROYALTY_CONFIG",
  SetComponentRoyaltyConfig = "SET_COMPONENT_ROYALTY_CONFIG",
  ClaimPackageRoyalty = "CLAIM_PACKAGE_ROYALTY",
  ClaimComponentRoyalty = "CLAIM_COMPONENT_ROYALTY",
  SetMethodAccessRule = "SET_METHOD_ACCESS_RULE",
  MintFungible = "MINT_FUNGIBLE",
  MintNonFungible = "MINT_NON_FUNGIBLE",
  MintUuidNonFungible = "MINT_UUID_NON_FUNGIBLE",
  CreateFungibleResource = "CREATE_FUNGIBLE_RESOURCE",
  CreateFungibleResourceWithInitialSupply = "CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY",
  CreateNonFungibleResource = "CREATE_NON_FUNGIBLE_RESOURCE",
  CreateNonFungibleResourceWithInitialSupply = "CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY",
  CreateAccessController = "CREATE_ACCESS_CONTROLLER",
  CreateIdentity = "CREATE_IDENTITY",
  AssertAccessRule = "ASSERT_ACCESS_RULE",
  CreateValidator = "CREATE_VALIDATOR",
  CreateAccount = "CREATE_ACCOUNT",
}

/**
 * An instruction to call a function with the given list of arguments on the given package address
 * and blueprint name.
 */
export class CallFunction extends Instruction {
  @Expose({ name: "package_address" })
  @Type(() => ManifestAstValue.Address)
  packageAddress: ManifestAstValue.Address;

  @Expose({ name: "blueprint_name" })
  @Type(() => ManifestAstValue.String)
  blueprintName: ManifestAstValue.String;

  @Expose({ name: "function_name" })
  @Type(() => ManifestAstValue.String)
  functionName: ManifestAstValue.String;

  @Expose({ name: "arguments" })
  @Type(() => ManifestAstValue.Value, ManifestAstValue.valueTypeOptions)
  arguments: Array<ManifestAstValue.Value> | null;

  constructor(
    packageAddress: ManifestAstValue.Address,
    blueprintName: ManifestAstValue.String,
    functionName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Value> | null = null
  ) {
    super(Kind.CallFunction);
    this.packageAddress = packageAddress;
    this.blueprintName = blueprintName;
    this.functionName = functionName;
    this.arguments = args;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to call a method with a given name on a given component address with the given
 * list of arguments.
 */
export class CallMethod extends Instruction {
  @Expose({ name: "component_address" })
  @Type(() => ManifestAstValue.Address)
  componentAddress: ManifestAstValue.Address;

  @Expose({ name: "method_name" })
  @Type(() => ManifestAstValue.String)
  methodName: ManifestAstValue.String;

  @Expose({ name: "arguments" })
  @Type(() => ManifestAstValue.Value, ManifestAstValue.valueTypeOptions)
  arguments: Array<ManifestAstValue.Value> | null;

  constructor(
    componentAddress: ManifestAstValue.Address,
    methodName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Value> | null = null
  ) {
    super(Kind.CallMethod);
    this.componentAddress = componentAddress;
    this.methodName = methodName;
    this.arguments = args;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to take the entire amount of a given resource address from the worktop and put it
 * in a bucket.
 */
export class TakeFromWorktop extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "into_bucket" })
  @Type(() => ManifestAstValue.Bucket)
  intoBucket: ManifestAstValue.Bucket;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    intoBucket: ManifestAstValue.Bucket
  ) {
    super(Kind.TakeFromWorktop);
    this.resourceAddress = resourceAddress;
    this.intoBucket = intoBucket;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to take the an amount of a given resource address from the worktop and put it in a
 * bucket.
 */
export class TakeFromWorktopByAmount extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "amount" })
  @Type(() => ManifestAstValue.Decimal)
  amount: ManifestAstValue.Decimal;

  @Expose({ name: "into_bucket" })
  @Type(() => ManifestAstValue.Bucket)
  intoBucket: ManifestAstValue.Bucket;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal,
    intoBucket: ManifestAstValue.Bucket
  ) {
    super(Kind.TakeFromWorktopByAmount);
    this.resourceAddress = resourceAddress;
    this.amount = amount;
    this.intoBucket = intoBucket;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to take the a set of non-fungible ids of a given resource address from the worktop
 * and put it in a bucket.
 */
export class TakeFromWorktopByIds extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "ids" })
  @Type(() => ManifestAstValue.NonFungibleLocalId)
  ids: Array<ManifestAstValue.NonFungibleLocalId>;

  @Expose({ name: "into_bucket" })
  @Type(() => ManifestAstValue.Bucket)
  intoBucket: ManifestAstValue.Bucket;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    ids: Array<ManifestAstValue.NonFungibleLocalId>,
    intoBucket: ManifestAstValue.Bucket
  ) {
    super(Kind.TakeFromWorktopByIds);
    this.resourceAddress = resourceAddress;
    this.ids = ids;
    this.intoBucket = intoBucket;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * Returns a bucket of tokens to the worktop.
 */
export class ReturnToWorktop extends Instruction {
  @Expose({ name: "bucket" })
  @Type(() => ManifestAstValue.Bucket)
  bucket: ManifestAstValue.Bucket;

  constructor(bucket: ManifestAstValue.Bucket) {
    super(Kind.ReturnToWorktop);
    this.bucket = bucket;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to assert that a given resource exists in the worktop.
 */
export class AssertWorktopContains extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  constructor(resourceAddress: ManifestAstValue.Address) {
    super(Kind.AssertWorktopContains);
    this.resourceAddress = resourceAddress;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to assert that a specific amount of a specific resource address exists in the
 * worktop.
 */
export class AssertWorktopContainsByAmount extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "amount" })
  @Type(() => ManifestAstValue.Decimal)
  amount: ManifestAstValue.Decimal;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal
  ) {
    super(Kind.AssertWorktopContainsByAmount);
    this.resourceAddress = resourceAddress;
    this.amount = amount;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to assert that a set ids of a specific resource address exists in the worktop.
 */
export class AssertWorktopContainsByIds extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "ids" })
  @Type(() => ManifestAstValue.NonFungibleLocalId)
  ids: Array<ManifestAstValue.NonFungibleLocalId>;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    ids: Array<ManifestAstValue.NonFungibleLocalId>
  ) {
    super(Kind.AssertWorktopContainsByIds);
    this.resourceAddress = resourceAddress;
    this.ids = ids;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction which pops a proof from the AuthZone stack and into an identifiable proof
 */
export class PopFromAuthZone extends Instruction {
  @Expose({ name: "into_proof" })
  @Type(() => ManifestAstValue.Proof)
  intoProof: ManifestAstValue.Proof;

  constructor(intoProof: ManifestAstValue.Proof) {
    super(Kind.PopFromAuthZone);
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction that pushes a proof to the auth zone stack.
 */
export class PushToAuthZone extends Instruction {
  @Expose({ name: "proof" })
  @Type(() => ManifestAstValue.Proof)
  proof: ManifestAstValue.Proof;

  constructor(proof: ManifestAstValue.Proof) {
    super(Kind.PushToAuthZone);
    this.proof = proof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction which clears the auth zone stack by dropping all of the proofs in that stack.
 */
export class ClearAuthZone extends Instruction {
  constructor() {
    super(Kind.ClearAuthZone);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * Clears all the proofs of signature virtual badges.
 */
export class ClearSignatureProofs extends Instruction {
  constructor() {
    super(Kind.ClearSignatureProofs);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to create a proof of the entire amount of a given resource address from the auth
 * zone.
 */
export class CreateProofFromAuthZone extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "into_proof" })
  @Type(() => ManifestAstValue.Proof)
  intoProof: ManifestAstValue.Proof;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    intoProof: ManifestAstValue.Proof
  ) {
    super(Kind.CreateProofFromAuthZone);
    this.resourceAddress = resourceAddress;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to create a proof of the an amount of a given resource address from the auth zone.
 */
export class CreateProofFromAuthZoneByAmount extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "amount" })
  @Type(() => ManifestAstValue.Decimal)
  amount: ManifestAstValue.Decimal;

  @Expose({ name: "into_proof" })
  @Type(() => ManifestAstValue.Proof)
  intoProof: ManifestAstValue.Proof;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal,
    intoProof: ManifestAstValue.Proof
  ) {
    super(Kind.CreateProofFromAuthZoneByAmount);
    this.resourceAddress = resourceAddress;
    this.amount = amount;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to create a proof of the a set of non-fungible ids of a given resource address
 * from the auth zone.
 */
export class CreateProofFromAuthZoneByIds extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "ids" })
  @Type(() => ManifestAstValue.NonFungibleLocalId)
  ids: Array<ManifestAstValue.NonFungibleLocalId>;

  @Expose({ name: "into_proof" })
  @Type(() => ManifestAstValue.Proof)
  intoProof: ManifestAstValue.Proof;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    ids: Array<ManifestAstValue.NonFungibleLocalId>,
    intoProof: ManifestAstValue.Proof
  ) {
    super(Kind.CreateProofFromAuthZoneByIds);
    this.resourceAddress = resourceAddress;
    this.ids = ids;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to create a proof given a bucket of some resources
 */
export class CreateProofFromBucket extends Instruction {
  @Expose({ name: "bucket" })
  @Type(() => ManifestAstValue.Bucket)
  bucket: ManifestAstValue.Bucket;

  @Expose({ name: "into_proof" })
  @Type(() => ManifestAstValue.Proof)
  intoProof: ManifestAstValue.Proof;

  constructor(
    bucket: ManifestAstValue.Bucket,
    intoProof: ManifestAstValue.Proof
  ) {
    super(Kind.CreateProofFromBucket);
    this.bucket = bucket;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to clone a proof creating a second proof identical to the original
 */
export class CloneProof extends Instruction {
  @Expose({ name: "proof" })
  @Type(() => ManifestAstValue.Proof)
  proof: ManifestAstValue.Proof;

  @Expose({ name: "into_proof" })
  @Type(() => ManifestAstValue.Proof)
  intoProof: ManifestAstValue.Proof;

  constructor(
    proof: ManifestAstValue.Proof,
    intoProof: ManifestAstValue.Proof
  ) {
    super(Kind.CloneProof);
    this.proof = proof;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to drop a proof.
 */
export class DropProof extends Instruction {
  @Expose({ name: "proof" })
  @Type(() => ManifestAstValue.Proof)
  proof: ManifestAstValue.Proof;

  constructor(proof: ManifestAstValue.Proof) {
    super(Kind.DropProof);
    this.proof = proof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to drop all proofs currently present in the transaction context.
 */
export class DropAllProofs extends Instruction {
  constructor() {
    super(Kind.DropAllProofs);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to publish a package and set it's associated royalty configs, metadata, and access
 * rules.
 */
export class PublishPackage extends Instruction {
  @Expose({ name: "code" })
  @Type(() => ManifestAstValue.Blob)
  code: ManifestAstValue.Blob;

  @Expose({ name: "schema" })
  @Type(() => ManifestAstValue.Blob)
  schema: ManifestAstValue.Blob;

  @Expose({ name: "royalty_config" })
  @Type(() => ManifestAstValue.Map)
  royaltyConfig: ManifestAstValue.Map;

  @Expose({ name: "metadata" })
  @Type(() => ManifestAstValue.Map)
  metadata: ManifestAstValue.Map;

  @Expose({ name: "access_rules" })
  @Type(() => ManifestAstValue.Value, ManifestAstValue.valueTypeOptions)
  accessRules: ManifestAstValue.Value;

  constructor(
    code: ManifestAstValue.Blob,
    schema: ManifestAstValue.Blob,
    royaltyConfig: ManifestAstValue.Map,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Value
  ) {
    super(Kind.PublishPackage);
    this.code = code;
    this.schema = schema;
    this.royaltyConfig = royaltyConfig;
    this.metadata = metadata;
    this.accessRules = accessRules;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to burn a bucket of tokens.
 */
export class BurnResource extends Instruction {
  @Expose({ name: "bucket" })
  @Type(() => ManifestAstValue.Bucket)
  bucket: ManifestAstValue.Bucket;

  constructor(bucket: ManifestAstValue.Bucket) {
    super(Kind.BurnResource);
    this.bucket = bucket;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction ot recall resources from a known vault.
 */
export class RecallResource extends Instruction {
  @Expose({ name: "vault_id" })
  @Type(() => ManifestAstValue.Bytes)
  vaultId: ManifestAstValue.Bytes;

  @Expose({ name: "amount" })
  @Type(() => ManifestAstValue.Decimal)
  amount: ManifestAstValue.Decimal;

  constructor(
    vaultId: ManifestAstValue.Bytes,
    amount: ManifestAstValue.Decimal
  ) {
    super(Kind.RecallResource);
    this.vaultId = vaultId;
    this.amount = amount;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to set the metadata on an entity.
 */
export class SetMetadata extends Instruction {
  @Expose({ name: "entity_address" })
  @Type(() => ManifestAstValue.Address)
  entityAddress: ManifestAstValue.Address;

  @Expose({ name: "key" })
  @Type(() => ManifestAstValue.String)
  key: ManifestAstValue.String;

  @Expose({ name: "value" })
  @Type(() => ManifestAstValue.Enum)
  value: ManifestAstValue.Enum;

  constructor(
    entityAddress: ManifestAstValue.Address,
    key: ManifestAstValue.String,
    value: ManifestAstValue.Enum
  ) {
    super(Kind.SetMetadata);
    this.entityAddress = entityAddress;
    this.key = key;
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to set the metadata on an entity.
 */
export class RemoveMetadata extends Instruction {
  @Expose({ name: "entity_address" })
  @Type(() => ManifestAstValue.Address)
  entityAddress: ManifestAstValue.Address;

  @Expose({ name: "key" })
  @Type(() => ManifestAstValue.String)
  key: ManifestAstValue.String;

  constructor(
    entityAddress: ManifestAstValue.Address,
    key: ManifestAstValue.String
  ) {
    super(Kind.RemoveMetadata);
    this.entityAddress = entityAddress;
    this.key = key;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to modify the royalties of a package.
 */
export class SetPackageRoyaltyConfig extends Instruction {
  @Expose({ name: "package_address" })
  @Type(() => ManifestAstValue.Address)
  packageAddress: ManifestAstValue.Address;

  @Expose({ name: "royalty_config" })
  @Type(() => ManifestAstValue.Map)
  royaltyConfig: ManifestAstValue.Map;

  constructor(
    packageAddress: ManifestAstValue.Address,
    royaltyConfig: ManifestAstValue.Map
  ) {
    super(Kind.SetPackageRoyaltyConfig);
    this.packageAddress = packageAddress;
    this.royaltyConfig = royaltyConfig;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to modify the royalties on a component
 */
export class SetComponentRoyaltyConfig extends Instruction {
  @Expose({ name: "component_address" })
  @Type(() => ManifestAstValue.Address)
  componentAddress: ManifestAstValue.Address;

  @Expose({ name: "royalty_config" })
  @Type(() => ManifestAstValue.Tuple)
  royaltyConfig: ManifestAstValue.Tuple;

  constructor(
    componentAddress: ManifestAstValue.Address,
    royaltyConfig: ManifestAstValue.Tuple
  ) {
    super(Kind.SetComponentRoyaltyConfig);
    this.componentAddress = componentAddress;
    this.royaltyConfig = royaltyConfig;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to claim royalties of a package
 */
export class ClaimPackageRoyalty extends Instruction {
  @Expose({ name: "package_address" })
  @Type(() => ManifestAstValue.Address)
  packageAddress: ManifestAstValue.Address;

  constructor(packageAddress: ManifestAstValue.Address) {
    super(Kind.ClaimPackageRoyalty);
    this.packageAddress = packageAddress;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to claim royalties of a component
 */
export class ClaimComponentRoyalty extends Instruction {
  @Expose({ name: "component_address" })
  @Type(() => ManifestAstValue.Address)
  componentAddress: ManifestAstValue.Address;

  constructor(componentAddress: ManifestAstValue.Address) {
    super(Kind.ClaimComponentRoyalty);
    this.componentAddress = componentAddress;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to modify the access rules of a method that an entity has.
 */
export class SetMethodAccessRule extends Instruction {
  @Expose({ name: "entity_address" })
  @Type(() => ManifestAstValue.Address)
  entityAddress: ManifestAstValue.Address;

  @Expose({ name: "key" })
  @Type(() => ManifestAstValue.Tuple)
  key: ManifestAstValue.Tuple;

  @Expose({ name: "rule" })
  @Type(() => ManifestAstValue.Enum)
  rule: ManifestAstValue.Enum;

  constructor(
    entityAddress: ManifestAstValue.Address,
    key: ManifestAstValue.Tuple,
    rule: ManifestAstValue.Enum
  ) {
    super(Kind.SetMethodAccessRule);
    this.entityAddress = entityAddress;
    this.key = key;
    this.rule = rule;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to mint fungible resources
 */
export class MintFungible extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "amount" })
  @Type(() => ManifestAstValue.Decimal)
  amount: ManifestAstValue.Decimal;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal
  ) {
    super(Kind.MintFungible);
    this.resourceAddress = resourceAddress;
    this.amount = amount;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to mint non-fungibles of a resource
 */
export class MintNonFungible extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "entries" })
  @Type(() => ManifestAstValue.Map)
  entries: ManifestAstValue.Map;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    entries: ManifestAstValue.Map
  ) {
    super(Kind.MintNonFungible);
    this.resourceAddress = resourceAddress;
    this.entries = entries;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to mint non-fungibles of a non-fungible resource that uses UUID as the type id and
 * perform auto incrimination of ID.
 */
export class MintUuidNonFungible extends Instruction {
  @Expose({ name: "resource_address" })
  @Type(() => ManifestAstValue.Address)
  resourceAddress: ManifestAstValue.Address;

  @Expose({ name: "entries" })
  @Type(() => ManifestAstValue.Array)
  entries: ManifestAstValue.Array;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    entries: ManifestAstValue.Array
  ) {
    super(Kind.MintUuidNonFungible);
    this.resourceAddress = resourceAddress;
    this.entries = entries;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to create a new fungible resource.
 */
export class CreateFungibleResource extends Instruction {
  @Expose({ name: "divisibility" })
  @Type(() => ManifestAstValue.U8)
  divisibility: ManifestAstValue.U8;

  @Expose({ name: "metadata" })
  @Type(() => ManifestAstValue.Map)
  metadata: ManifestAstValue.Map;

  @Expose({ name: "access_rules" })
  @Type(() => ManifestAstValue.Map)
  accessRules: ManifestAstValue.Map;

  constructor(
    divisibility: ManifestAstValue.U8,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map
  ) {
    super(Kind.CreateFungibleResource);
    this.divisibility = divisibility;
    this.metadata = metadata;
    this.accessRules = accessRules;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to create a fungible resource with initial supply
 */
export class CreateFungibleResourceWithInitialSupply extends Instruction {
  @Expose({ name: "divisibility" })
  @Type(() => ManifestAstValue.U8)
  divisibility: ManifestAstValue.U8;

  @Expose({ name: "metadata" })
  @Type(() => ManifestAstValue.Map)
  metadata: ManifestAstValue.Map;

  @Expose({ name: "access_rules" })
  @Type(() => ManifestAstValue.Map)
  accessRules: ManifestAstValue.Map;

  @Expose({ name: "initial_supply" })
  @Type(() => ManifestAstValue.Decimal)
  initialSupply: ManifestAstValue.Decimal;

  constructor(
    divisibility: ManifestAstValue.U8,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map,
    initialSupply: ManifestAstValue.Decimal
  ) {
    super(Kind.CreateFungibleResourceWithInitialSupply);
    this.divisibility = divisibility;
    this.metadata = metadata;
    this.accessRules = accessRules;
    this.initialSupply = initialSupply;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to create a new non-fungible resource.
 */
export class CreateNonFungibleResource extends Instruction {
  @Expose({ name: "id_type" })
  @Type(() => ManifestAstValue.Enum)
  idType: ManifestAstValue.Enum;

  @Expose({ name: "schema" })
  @Type(() => ManifestAstValue.Tuple)
  schema: ManifestAstValue.Tuple;

  @Expose({ name: "metadata" })
  @Type(() => ManifestAstValue.Map)
  metadata: ManifestAstValue.Map;

  @Expose({ name: "access_rules" })
  @Type(() => ManifestAstValue.Map)
  accessRules: ManifestAstValue.Map;

  constructor(
    idType: ManifestAstValue.Enum,
    schema: ManifestAstValue.Tuple,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map
  ) {
    super(Kind.CreateNonFungibleResource);
    this.idType = idType;
    this.schema = schema;
    this.metadata = metadata;
    this.accessRules = accessRules;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to create a non-fungible resource with an initial supply
 */
export class CreateNonFungibleResourceWithInitialSupply extends Instruction {
  @Expose({ name: "id_type" })
  @Type(() => ManifestAstValue.Enum)
  idType: ManifestAstValue.Enum;

  @Expose({ name: "schema" })
  @Type(() => ManifestAstValue.Blob)
  schema: ManifestAstValue.Blob;

  @Expose({ name: "metadata" })
  @Type(() => ManifestAstValue.Map)
  metadata: ManifestAstValue.Map;

  @Expose({ name: "access_rules" })
  @Type(() => ManifestAstValue.Map)
  accessRules: ManifestAstValue.Map;

  @Expose({ name: "initial_supply" })
  @Type(() => ManifestAstValue.Value, ManifestAstValue.valueTypeOptions)
  initialSupply: ManifestAstValue.Value;

  constructor(
    idType: ManifestAstValue.Enum,
    schema: ManifestAstValue.Blob,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map,
    initialSupply: ManifestAstValue.Value
  ) {
    super(Kind.CreateNonFungibleResourceWithInitialSupply);
    this.idType = idType;
    this.schema = schema;
    this.metadata = metadata;
    this.accessRules = accessRules;
    this.initialSupply = initialSupply;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * Creates a new access controller native component with the passed set of rules as the current
 * active rule set and the specified timed recovery delay in minutes.
 */
export class CreateAccessController extends Instruction {
  @Expose({ name: "controlled_asset" })
  @Type(() => ManifestAstValue.Bucket)
  controlledAsset: ManifestAstValue.Bucket;

  @Expose({ name: "rule_set" })
  @Type(() => ManifestAstValue.Tuple)
  ruleSet: ManifestAstValue.Tuple;

  @Expose({ name: "timed_recovery_delay_in_minutes" })
  @Type(() => ManifestAstValue.Value, {
    discriminator: {
      property: "type",
      subTypes: [
        { name: "Some", value: ManifestAstValue.Some },
        { name: "None", value: ManifestAstValue.None },
        { name: "Enum", value: ManifestAstValue.Enum },
      ],
    },
  })
  timedRecoveryDelayInMinutes:
    | ManifestAstValue.Some
    | ManifestAstValue.None
    | ManifestAstValue.Enum;

  /**
   * The set of rules to use for the access controller's primary, confirmation, and recovery roles.
   */
  /**
   * The set of rules to use for the access controller's primary, confirmation, and recovery roles.
   */

  constructor(
    controlledAsset: ManifestAstValue.Bucket,
    ruleSet: ManifestAstValue.Tuple,
    timedRecoveryDelayInMinutes:
      | ManifestAstValue.Some
      | ManifestAstValue.None
      | ManifestAstValue.Enum
  ) {
    super(Kind.CreateAccessController);
    this.controlledAsset = controlledAsset;
    this.ruleSet = ruleSet;
    this.timedRecoveryDelayInMinutes = timedRecoveryDelayInMinutes;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * Creates a new identity native component with the passed access rule.
 */
export class CreateIdentity extends Instruction {
  @Expose({ name: "access_rule" })
  @Type(() => ManifestAstValue.Enum)
  accessRule: ManifestAstValue.Enum;

  constructor(accessRule: ManifestAstValue.Enum) {
    super(Kind.CreateIdentity);
    this.accessRule = accessRule;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * Assert that the given access rule is currently fulfilled by the proofs in the Auth Zone of the
 * transaction
 */
export class AssertAccessRule extends Instruction {
  @Expose({ name: "access_rule" })
  @Type(() => ManifestAstValue.Enum)
  accessRule: ManifestAstValue.Enum;

  constructor(accessRule: ManifestAstValue.Enum) {
    super(Kind.AssertAccessRule);
    this.accessRule = accessRule;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * Creates a validator given the public key of the owner who controls it
 */
export class CreateValidator extends Instruction {
  @Expose({ name: "key" })
  @Type(() => ManifestAstValue.Bytes)
  key: ManifestAstValue.Bytes;

  @Expose({ name: "owner_access_rule" })
  @Type(() => ManifestAstValue.Enum)
  ownerAccessRule: ManifestAstValue.Enum;

  constructor(
    key: ManifestAstValue.Bytes,
    ownerAccessRule: ManifestAstValue.Enum
  ) {
    super(Kind.CreateValidator);
    this.key = key;
    this.ownerAccessRule = ownerAccessRule;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * Creates a new global account component which has the withdraw rule seen in the rule.
 */
export class CreateAccount extends Instruction {
  @Expose({ name: "withdraw_rule" })
  @Type(() => ManifestAstValue.Enum)
  withdrawRule: ManifestAstValue.Enum;

  constructor(withdrawRule: ManifestAstValue.Enum) {
    super(Kind.CreateAccount);
    this.withdrawRule = withdrawRule;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export const valueTypeOptions: TypeOptions = {
  discriminator: {
    property: "instruction",
    subTypes: [
      { name: "CALL_FUNCTION", value: CallFunction },
      { name: "CALL_METHOD", value: CallMethod },
      { name: "TAKE_FROM_WORKTOP", value: TakeFromWorktop },
      { name: "TAKE_FROM_WORKTOP_BY_AMOUNT", value: TakeFromWorktopByAmount },
      { name: "TAKE_FROM_WORKTOP_BY_IDS", value: TakeFromWorktopByIds },
      { name: "RETURN_TO_WORKTOP", value: ReturnToWorktop },
      { name: "ASSERT_WORKTOP_CONTAINS", value: AssertWorktopContains },
      {
        name: "AssertWorktopContainsByAmount",
        value: AssertWorktopContainsByAmount,
      },
      {
        name: "ASSERT_WORKTOP_CONTAINS_BY_IDS",
        value: AssertWorktopContainsByIds,
      },
      { name: "POP_FROM_AUTH_ZONE", value: PopFromAuthZone },
      { name: "PUSH_TO_AUTH_ZONE", value: PushToAuthZone },
      { name: "CLEAR_AUTH_ZONE", value: ClearAuthZone },
      { name: "CLEAR_SIGNATURE_PROOFS", value: ClearSignatureProofs },
      { name: "CREATE_PROOF_FROM_AUTH_ZONE", value: CreateProofFromAuthZone },
      {
        name: "CreateProofFromAuthZoneByAmount",
        value: CreateProofFromAuthZoneByAmount,
      },
      {
        name: "CreateProofFromAuthZoneByIds",
        value: CreateProofFromAuthZoneByIds,
      },
      { name: "CREATE_PROOF_FROM_BUCKET", value: CreateProofFromBucket },
      { name: "CLONE_PROOF", value: CloneProof },
      { name: "DROP_PROOF", value: DropProof },
      { name: "DROP_ALL_PROOFS", value: DropAllProofs },
      { name: "PUBLISH_PACKAGE", value: PublishPackage },
      { name: "BURN_RESOURCE", value: BurnResource },
      { name: "RECALL_RESOURCE", value: RecallResource },
      { name: "SET_METADATA", value: SetMetadata },
      { name: "REMOVE_METADATA", value: RemoveMetadata },
      { name: "SET_PACKAGE_ROYALTY_CONFIG", value: SetPackageRoyaltyConfig },
      {
        name: "SET_COMPONENT_ROYALTY_CONFIG",
        value: SetComponentRoyaltyConfig,
      },
      { name: "CLAIM_PACKAGE_ROYALTY", value: ClaimPackageRoyalty },
      { name: "CLAIM_COMPONENT_ROYALTY", value: ClaimComponentRoyalty },
      { name: "SET_METHOD_ACCESS_RULE", value: SetMethodAccessRule },
      { name: "MINT_FUNGIBLE", value: MintFungible },
      { name: "MINT_NON_FUNGIBLE", value: MintNonFungible },
      { name: "MINT_UUID_NON_FUNGIBLE", value: MintUuidNonFungible },
      { name: "CREATE_FUNGIBLE_RESOURCE", value: CreateFungibleResource },
      {
        name: "CreateFungibleResourceWithInitialSupply",
        value: CreateFungibleResourceWithInitialSupply,
      },
      {
        name: "CREATE_NON_FUNGIBLE_RESOURCE",
        value: CreateNonFungibleResource,
      },
      {
        name: "CreateNonFungibleResourceWithInitialSupply",
        value: CreateNonFungibleResourceWithInitialSupply,
      },
      { name: "CREATE_ACCESS_CONTROLLER", value: CreateAccessController },
      { name: "CREATE_IDENTITY", value: CreateIdentity },
      { name: "ASSERT_ACCESS_RULE", value: AssertAccessRule },
      { name: "CREATE_VALIDATOR", value: CreateValidator },
      { name: "CREATE_ACCOUNT", value: CreateAccount },
    ],
  },
};
