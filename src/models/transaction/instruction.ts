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

import { ManifestAstValue } from "models/value";

export type Any =
  | CallFunction
  | CallMethod
  | TakeFromWorktop
  | TakeFromWorktopByAmount
  | TakeFromWorktopByIds
  | ReturnToWorktop
  | AssertWorktopContains
  | AssertWorktopContainsByAmount
  | AssertWorktopContainsByIds
  | PopFromAuthZone
  | PushToAuthZone
  | ClearAuthZone
  | ClearSignatureProofs
  | CreateProofFromAuthZone
  | CreateProofFromAuthZoneByAmount
  | CreateProofFromAuthZoneByIds
  | CreateProofFromBucket
  | CloneProof
  | DropProof
  | DropAllProofs
  | PublishPackage
  | BurnResource
  | RecallResource
  | SetMetadata
  | RemoveMetadata
  | SetPackageRoyaltyConfig
  | SetComponentRoyaltyConfig
  | ClaimPackageRoyalty
  | ClaimComponentRoyalty
  | SetMethodAccessRule
  | MintFungible
  | MintNonFungible
  | MintUuidNonFungible
  | CreateFungibleResource
  | CreateFungibleResourceWithInitialSupply
  | CreateNonFungibleResource
  | CreateNonFungibleResourceWithInitialSupply
  | CreateAccessController
  | CreateIdentity
  | AssertAccessRule
  | CreateValidator
  | CreateAccount;

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
export class CallFunction {
  instruction: Kind = Kind.CallFunction;
  packageAddress: ManifestAstValue.Address;
  blueprintName: ManifestAstValue.String;
  functionName: ManifestAstValue.String;
  arguments: Array<ManifestAstValue.Value> | null;

  constructor(
    packageAddress: ManifestAstValue.Address,
    blueprintName: ManifestAstValue.String,
    functionName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Value> | null = null
  ) {
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
export class CallMethod {
  instruction: Kind = Kind.CallMethod;
  componentAddress: ManifestAstValue.Address;
  methodName: ManifestAstValue.String;
  arguments: Array<ManifestAstValue.Value> | null;

  constructor(
    componentAddress: ManifestAstValue.Address,
    methodName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Value> | null = null
  ) {
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
export class TakeFromWorktop {
  instruction: Kind = Kind.TakeFromWorktop;
  resourceAddress: ManifestAstValue.Address;
  intoBucket: ManifestAstValue.Bucket;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    intoBucket: ManifestAstValue.Bucket
  ) {
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
export class TakeFromWorktopByAmount {
  instruction: Kind = Kind.TakeFromWorktopByAmount;
  resourceAddress: ManifestAstValue.Address;
  amount: ManifestAstValue.Decimal;
  intoBucket: ManifestAstValue.Bucket;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal,
    intoBucket: ManifestAstValue.Bucket
  ) {
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
export class TakeFromWorktopByIds {
  instruction: Kind = Kind.TakeFromWorktopByIds;
  resourceAddress: ManifestAstValue.Address;
  ids: Array<ManifestAstValue.NonFungibleLocalId>;
  intoBucket: ManifestAstValue.Bucket;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    ids: Array<ManifestAstValue.NonFungibleLocalId>,
    intoBucket: ManifestAstValue.Bucket
  ) {
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
export class ReturnToWorktop {
  instruction: Kind = Kind.ReturnToWorktop;
  bucket: ManifestAstValue.Bucket;

  constructor(bucket: ManifestAstValue.Bucket) {
    this.bucket = bucket;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to assert that a given resource exists in the worktop.
 */
export class AssertWorktopContains {
  instruction: Kind = Kind.AssertWorktopContains;
  resourceAddress: ManifestAstValue.Address;

  constructor(resourceAddress: ManifestAstValue.Address) {
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
export class AssertWorktopContainsByAmount {
  instruction: Kind = Kind.AssertWorktopContainsByAmount;
  resourceAddress: ManifestAstValue.Address;
  amount: ManifestAstValue.Decimal;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal
  ) {
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
export class AssertWorktopContainsByIds {
  instruction: Kind = Kind.AssertWorktopContainsByIds;
  resourceAddress: ManifestAstValue.Address;
  ids: Array<ManifestAstValue.NonFungibleLocalId>;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    ids: Array<ManifestAstValue.NonFungibleLocalId>
  ) {
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
export class PopFromAuthZone {
  instruction: Kind = Kind.PopFromAuthZone;
  intoProof: ManifestAstValue.Proof;

  constructor(intoProof: ManifestAstValue.Proof) {
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction that pushes a proof to the auth zone stack.
 */
export class PushToAuthZone {
  instruction: Kind = Kind.PushToAuthZone;
  proof: ManifestAstValue.Proof;

  constructor(proof: ManifestAstValue.Proof) {
    this.proof = proof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction which clears the auth zone stack by dropping all of the proofs in that stack.
 */
export class ClearAuthZone {
  instruction: Kind = Kind.ClearAuthZone;

  constructor() {}
}

/**
 * Clears all the proofs of signature virtual badges.
 */
export class ClearSignatureProofs {
  instruction: Kind = Kind.ClearSignatureProofs;

  constructor() {}
}

/**
 * An instruction to create a proof of the entire amount of a given resource address from the auth
 * zone.
 */
export class CreateProofFromAuthZone {
  instruction: Kind = Kind.CreateProofFromAuthZone;
  resourceAddress: ManifestAstValue.Address;
  intoProof: ManifestAstValue.Proof;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    intoProof: ManifestAstValue.Proof
  ) {
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
export class CreateProofFromAuthZoneByAmount {
  instruction: Kind = Kind.CreateProofFromAuthZoneByAmount;
  resourceAddress: ManifestAstValue.Address;
  amount: ManifestAstValue.Decimal;
  intoProof: ManifestAstValue.Proof;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal,
    intoProof: ManifestAstValue.Proof
  ) {
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
export class CreateProofFromAuthZoneByIds {
  instruction: Kind = Kind.CreateProofFromAuthZoneByIds;
  resourceAddress: ManifestAstValue.Address;
  ids: Array<ManifestAstValue.NonFungibleLocalId>;
  intoProof: ManifestAstValue.Proof;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    ids: Array<ManifestAstValue.NonFungibleLocalId>,
    intoProof: ManifestAstValue.Proof
  ) {
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
export class CreateProofFromBucket {
  instruction: Kind = Kind.CreateProofFromBucket;
  bucket: ManifestAstValue.Bucket;
  intoProof: ManifestAstValue.Proof;

  constructor(
    bucket: ManifestAstValue.Bucket,
    intoProof: ManifestAstValue.Proof
  ) {
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
export class CloneProof {
  instruction: Kind = Kind.CloneProof;
  proof: ManifestAstValue.Proof;
  intoProof: ManifestAstValue.Proof;

  constructor(
    proof: ManifestAstValue.Proof,
    intoProof: ManifestAstValue.Proof
  ) {
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
export class DropProof {
  instruction: Kind = Kind.DropProof;
  proof: ManifestAstValue.Proof;

  constructor(proof: ManifestAstValue.Proof) {
    this.proof = proof;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to drop all proofs currently present in the transaction context.
 */
export class DropAllProofs {
  instruction: Kind = Kind.DropAllProofs;

  constructor() {}
}

/**
 * An instruction to publish a package and set it's associated royalty configs, metadata, and access
 * rules.
 */
export class PublishPackage {
  instruction: Kind = Kind.PublishPackage;
  code: ManifestAstValue.Blob;
  schema: ManifestAstValue.Blob;
  royaltyConfig: ManifestAstValue.Tuple;
  metadata: ManifestAstValue.Map;
  accessRules: ManifestAstValue.Value;

  constructor(
    code: ManifestAstValue.Blob,
    schema: ManifestAstValue.Blob,
    royaltyConfig: ManifestAstValue.Tuple,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Value
  ) {
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
export class BurnResource {
  instruction: Kind = Kind.BurnResource;
  bucket: ManifestAstValue.Bucket;

  constructor(bucket: ManifestAstValue.Bucket) {
    this.bucket = bucket;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction ot recall resources from a known vault.
 */
export class RecallResource {
  instruction: Kind = Kind.RecallResource;
  vaultId: ManifestAstValue.Bytes;
  amount: ManifestAstValue.Decimal;

  /**
   * The id of the vault of the tokens to recall. This field is serialized as an `Own` from the
   * value model and is expected to be an `Own::Vault`.
   */
  /**
   * The id of the vault of the tokens to recall. This field is serialized as an `Own` from the
   * value model and is expected to be an `Own::Vault`.
   */

  constructor(
    vaultId: ManifestAstValue.Bytes,
    amount: ManifestAstValue.Decimal
  ) {
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
export class SetMetadata {
  instruction: Kind = Kind.SetMetadata;
  entityAddress: ManifestAstValue.Address;
  key: ManifestAstValue.String;
  value: ManifestAstValue.Enum;

  constructor(
    entityAddress: ManifestAstValue.Address,
    key: ManifestAstValue.String,
    value: ManifestAstValue.Enum
  ) {
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
export class RemoveMetadata {
  instruction: Kind = Kind.RemoveMetadata;
  entityAddress: ManifestAstValue.Address;
  key: ManifestAstValue.String;

  constructor(
    entityAddress: ManifestAstValue.Address,
    key: ManifestAstValue.String
  ) {
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
export class SetPackageRoyaltyConfig {
  instruction: Kind = Kind.SetPackageRoyaltyConfig;
  packageAddress: ManifestAstValue.Address;
  royaltyConfig: ManifestAstValue.Map;

  constructor(
    packageAddress: ManifestAstValue.Address,
    royaltyConfig: ManifestAstValue.Map
  ) {
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
export class SetComponentRoyaltyConfig {
  instruction: Kind = Kind.SetComponentRoyaltyConfig;
  componentAddress: ManifestAstValue.Address;
  royaltyConfig: ManifestAstValue.Tuple;

  constructor(
    componentAddress: ManifestAstValue.Address,
    royaltyConfig: ManifestAstValue.Tuple
  ) {
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
export class ClaimPackageRoyalty {
  instruction: Kind = Kind.ClaimPackageRoyalty;
  packageAddress: ManifestAstValue.Address;

  constructor(packageAddress: ManifestAstValue.Address) {
    this.packageAddress = packageAddress;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to claim royalties of a component
 */
export class ClaimComponentRoyalty {
  instruction: Kind = Kind.ClaimComponentRoyalty;
  componentAddress: ManifestAstValue.Address;

  constructor(componentAddress: ManifestAstValue.Address) {
    this.componentAddress = componentAddress;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * An instruction to modify the access rules of a method that an entity has.
 */
export class SetMethodAccessRule {
  instruction: Kind = Kind.SetMethodAccessRule;
  entityAddress: ManifestAstValue.Address;
  key: ManifestAstValue.String;
  rule: ManifestAstValue.Enum;

  constructor(
    entityAddress: ManifestAstValue.Address,
    key: ManifestAstValue.String,
    rule: ManifestAstValue.Enum
  ) {
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
export class MintFungible {
  instruction: Kind = Kind.MintFungible;
  resourceAddress: ManifestAstValue.Address;
  amount: ManifestAstValue.Decimal;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal
  ) {
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
export class MintNonFungible {
  instruction: Kind = Kind.MintNonFungible;
  resourceAddress: ManifestAstValue.Address;
  entries: ManifestAstValue.Map;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    entries: ManifestAstValue.Map
  ) {
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
export class MintUuidNonFungible {
  instruction: Kind = Kind.MintUuidNonFungible;
  resourceAddress: ManifestAstValue.Address;
  entries: ManifestAstValue.Array;

  constructor(
    resourceAddress: ManifestAstValue.Address,
    entries: ManifestAstValue.Array
  ) {
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
export class CreateFungibleResource {
  instruction: Kind = Kind.CreateFungibleResource;
  divisibility: ManifestAstValue.U8;
  metadata: ManifestAstValue.Map;
  accessRules: ManifestAstValue.Map;

  constructor(
    divisibility: ManifestAstValue.U8,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map
  ) {
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
export class CreateFungibleResourceWithInitialSupply {
  instruction: Kind = Kind.CreateFungibleResourceWithInitialSupply;
  divisibility: ManifestAstValue.U8;
  metadata: ManifestAstValue.Map;
  accessRules: ManifestAstValue.Map;
  initialSupply: ManifestAstValue.Decimal;

  constructor(
    divisibility: ManifestAstValue.U8,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map,
    initialSupply: ManifestAstValue.Decimal
  ) {
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
export class CreateNonFungibleResource {
  instruction: Kind = Kind.CreateNonFungibleResource;
  idType: ManifestAstValue.Enum;
  schema: ManifestAstValue.Blob;
  metadata: ManifestAstValue.Map;
  accessRules: ManifestAstValue.Map;

  constructor(
    idType: ManifestAstValue.Enum,
    schema: ManifestAstValue.Blob,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map
  ) {
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
export class CreateNonFungibleResourceWithInitialSupply {
  instruction: Kind = Kind.CreateNonFungibleResourceWithInitialSupply;
  idType: ManifestAstValue.Enum;
  schema: ManifestAstValue.Blob;
  metadata: ManifestAstValue.Map;
  accessRules: ManifestAstValue.Map;
  initialSupply: ManifestAstValue.Value;

  constructor(
    idType: ManifestAstValue.Enum,
    schema: ManifestAstValue.Blob,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map,
    initialSupply: ManifestAstValue.Value
  ) {
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
export class CreateAccessController {
  instruction: Kind = Kind.CreateAccessController;
  controlledAsset: ManifestAstValue.Bucket;
  ruleSet: ManifestAstValue.Tuple;
  private timedRecoveryDelayInMinutes:
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
export class CreateIdentity {
  instruction: Kind = Kind.CreateIdentity;
  accessRule: ManifestAstValue.Enum;

  constructor(accessRule: ManifestAstValue.Enum) {
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
export class AssertAccessRule {
  instruction: Kind = Kind.AssertAccessRule;
  accessRule: ManifestAstValue.Enum;

  constructor(accessRule: ManifestAstValue.Enum) {
    this.accessRule = accessRule;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

/**
 * Creates a validator given the public key of the owner who controls it
 */
export class CreateValidator {
  instruction: Kind = Kind.CreateValidator;
  key: ManifestAstValue.String;
  ownerAccessRule: ManifestAstValue.Enum;

  constructor(
    key: ManifestAstValue.String,
    ownerAccessRule: ManifestAstValue.Enum
  ) {
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
export class CreateAccount {
  instruction: Kind = Kind.CreateAccount;
  withdrawRule: ManifestAstValue.Enum;

  constructor(withdrawRule: ManifestAstValue.Enum) {
    this.withdrawRule = withdrawRule;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}
