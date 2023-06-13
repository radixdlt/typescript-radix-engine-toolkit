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

const manifestAstValueTypeOptions: TypeOptions = {
  discriminator: {
    property: "kind",
    subTypes: [
      { name: "Bool", value: ManifestAstValue.Bool },
      { name: "U8", value: ManifestAstValue.U8 },
      { name: "U16", value: ManifestAstValue.U16 },
      { name: "U32", value: ManifestAstValue.U32 },
      { name: "U64", value: ManifestAstValue.U64 },
      { name: "U128", value: ManifestAstValue.U128 },
      { name: "I8", value: ManifestAstValue.I8 },
      { name: "I16", value: ManifestAstValue.I16 },
      { name: "I32", value: ManifestAstValue.I32 },
      { name: "I64", value: ManifestAstValue.I64 },
      { name: "I128", value: ManifestAstValue.I128 },
      { name: "String", value: ManifestAstValue.String },
      { name: "Enum", value: ManifestAstValue.Enum },
      { name: "Some", value: ManifestAstValue.Some },
      { name: "None", value: ManifestAstValue.None },
      { name: "Ok", value: ManifestAstValue.Ok },
      { name: "Err", value: ManifestAstValue.Err },
      { name: "Array", value: ManifestAstValue.Array },
      { name: "Map", value: ManifestAstValue.Map },
      { name: "Tuple", value: ManifestAstValue.Tuple },
      { name: "Decimal", value: ManifestAstValue.Decimal },
      { name: "PreciseDecimal", value: ManifestAstValue.PreciseDecimal },
      { name: "Address", value: ManifestAstValue.Address },
      { name: "Bucket", value: ManifestAstValue.Bucket },
      { name: "Proof", value: ManifestAstValue.Proof },
      {
        name: "NonFungibleLocalId",
        value: ManifestAstValue.NonFungibleLocalId,
      },
      {
        name: "NonFungibleGlobalId",
        value: ManifestAstValue.NonFungibleGlobalId,
      },
      { name: "Expression", value: ManifestAstValue.Expression },
      { name: "Blob", value: ManifestAstValue.Blob },
      { name: "Bytes", value: ManifestAstValue.Bytes },
    ],
  },
};

export enum Kind {
  CallFunction = "CALL_FUNCTION",
  CallMethod = "CALL_METHOD",
  CallRoyaltyMethod = "CALL_ROYALTY_METHOD",
  CallMetadataMethod = "CALL_METADATA_METHOD",
  CallAccessRulesMethod = "CALL_ACCESS_RULES_METHOD",
  TakeAllFromWorktop = "TAKE_ALL_FROM_WORKTOP",
  TakeFromWorktop = "TAKE_FROM_WORKTOP",
  TakeNonFungiblesFromWorktop = "TAKE_NON_FUNGIBLES_FROM_WORKTOP",
  ReturnToWorktop = "RETURN_TO_WORKTOP",
  AssertWorktopContains = "ASSERT_WORKTOP_CONTAINS",
  AssertWorktopContainsNonFungibles = "ASSERT_WORKTOP_CONTAINS_NON_FUNGIBLES",
  PopFromAuthZone = "POP_FROM_AUTH_ZONE",
  PushToAuthZone = "PUSH_TO_AUTH_ZONE",
  ClearAuthZone = "CLEAR_AUTH_ZONE",
  ClearSignatureProofs = "CLEAR_SIGNATURE_PROOFS",
  CreateProofFromAuthZone = "CREATE_PROOF_FROM_AUTH_ZONE",
  CreateProofFromAuthZoneOfAll = "CREATE_PROOF_FROM_AUTH_ZONE_OF_ALL",
  CreateProofFromAuthZoneOfAmount = "CREATE_PROOF_FROM_AUTH_ZONE_OF_AMOUNT",
  CreateProofFromAuthZoneOfNonFungibles = "CREATE_PROOF_FROM_AUTH_ZONE_OF_NON_FUNGIBLES",
  CreateProofFromBucket = "CREATE_PROOF_FROM_BUCKET",
  CreateProofFromBucketOfAll = "CREATE_PROOF_FROM_BUCKET_OF_ALL",
  CreateProofFromBucketOfAmount = "CREATE_PROOF_FROM_BUCKET_OF_AMOUNT",
  CreateProofFromBucketOfNonFungibles = "CREATE_PROOF_FROM_BUCKET_OF_NON_FUNGIBLES",
  CloneProof = "CLONE_PROOF",
  DropProof = "DROP_PROOF",
  DropAllProofs = "DROP_ALL_PROOFS",
  PublishPackage = "PUBLISH_PACKAGE",
  PublishPackageAdvanced = "PUBLISH_PACKAGE_ADVANCED",
  BurnResource = "BURN_RESOURCE",
  RecallResource = "RECALL_RESOURCE",
  SetMetadata = "SET_METADATA",
  RemoveMetadata = "REMOVE_METADATA",
  SetPackageRoyaltyConfig = "SET_PACKAGE_ROYALTY_CONFIG",
  SetComponentRoyaltyConfig = "SET_COMPONENT_ROYALTY_CONFIG",
  ClaimPackageRoyalty = "CLAIM_PACKAGE_ROYALTY",
  ClaimComponentRoyalty = "CLAIM_COMPONENT_ROYALTY",
  SetAuthorityAccessRule = "SET_AUTHORITY_ACCESS_RULE",
  SetAuthorityMutability = "SET_AUTHORITY_MUTABILITY",
  MintFungible = "MINT_FUNGIBLE",
  MintNonFungible = "MINT_NON_FUNGIBLE",
  MintUuidNonFungible = "MINT_UUID_NON_FUNGIBLE",
  CreateFungibleResource = "CREATE_FUNGIBLE_RESOURCE",
  CreateFungibleResourceWithInitialSupply = "CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY",
  CreateNonFungibleResource = "CREATE_NON_FUNGIBLE_RESOURCE",
  CreateNonFungibleResourceWithInitialSupply = "CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY",
  CreateAccessController = "CREATE_ACCESS_CONTROLLER",
  CreateIdentity = "CREATE_IDENTITY",
  CreateIdentityAdvanced = "CREATE_IDENTITY_ADVANCED",
  CreateValidator = "CREATE_VALIDATOR",
  CreateAccount = "CREATE_ACCOUNT",
  CreateAccountAdvanced = "CREATE_ACCOUNT_ADVANCED",
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
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  arguments: Array<ManifestAstValue.Value>;

  constructor(
    packageAddress: ManifestAstValue.Address,
    blueprintName: ManifestAstValue.String,
    functionName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Value>
  ) {
    super(Kind.CallFunction);
    this.packageAddress = packageAddress;
    this.blueprintName = blueprintName;
    this.functionName = functionName;
    this.arguments = args;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  arguments: Array<ManifestAstValue.Value>;

  constructor(
    componentAddress: ManifestAstValue.Address,
    methodName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Value>
  ) {
    super(Kind.CallMethod);
    this.componentAddress = componentAddress;
    this.methodName = methodName;
    this.arguments = args;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to call a method with a given name on a given component address with the given
 * list of arguments.
 */
export class CallRoyaltyMethod extends Instruction {
  @Expose({ name: "component_address" })
  @Type(() => ManifestAstValue.Address)
  componentAddress: ManifestAstValue.Address;

  @Expose({ name: "method_name" })
  @Type(() => ManifestAstValue.String)
  methodName: ManifestAstValue.String;

  @Expose({ name: "arguments" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  arguments: Array<ManifestAstValue.Value> | null;

  constructor(
    componentAddress: ManifestAstValue.Address,
    methodName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Value>
  ) {
    super(Kind.CallRoyaltyMethod);
    this.componentAddress = componentAddress;
    this.methodName = methodName;
    this.arguments = args;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to call a method with a given name on a given component address with the given
 * list of arguments.
 */
export class CallMetadataMethod extends Instruction {
  @Expose({ name: "component_address" })
  @Type(() => ManifestAstValue.Address)
  componentAddress: ManifestAstValue.Address;

  @Expose({ name: "method_name" })
  @Type(() => ManifestAstValue.String)
  methodName: ManifestAstValue.String;

  @Expose({ name: "arguments" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  arguments: Array<ManifestAstValue.Value> | null;

  constructor(
    componentAddress: ManifestAstValue.Address,
    methodName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Value>
  ) {
    super(Kind.CallMetadataMethod);
    this.componentAddress = componentAddress;
    this.methodName = methodName;
    this.arguments = args;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to call a method with a given name on a given component address with the given
 * list of arguments.
 */
export class CallAccessRulesMethod extends Instruction {
  @Expose({ name: "component_address" })
  @Type(() => ManifestAstValue.Address)
  componentAddress: ManifestAstValue.Address;

  @Expose({ name: "method_name" })
  @Type(() => ManifestAstValue.String)
  methodName: ManifestAstValue.String;

  @Expose({ name: "arguments" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  arguments: Array<ManifestAstValue.Value> | null;

  constructor(
    componentAddress: ManifestAstValue.Address,
    methodName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Value>
  ) {
    super(Kind.CallAccessRulesMethod);
    this.componentAddress = componentAddress;
    this.methodName = methodName;
    this.arguments = args;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to take the entire amount of a given resource address from the worktop and put it
 * in a bucket.
 */
export class TakeAllFromWorktop extends Instruction {
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
    super(Kind.TakeAllFromWorktop);
    this.resourceAddress = resourceAddress;
    this.intoBucket = intoBucket;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to take the an amount of a given resource address from the worktop and put it in a
 * bucket.
 */
export class TakeFromWorktop extends Instruction {
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
    super(Kind.TakeFromWorktop);
    this.resourceAddress = resourceAddress;
    this.amount = amount;
    this.intoBucket = intoBucket;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to take the a set of non-fungible ids of a given resource address from the worktop
 * and put it in a bucket.
 */
export class TakeNonFungiblesFromWorktop extends Instruction {
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
    super(Kind.TakeNonFungiblesFromWorktop);
    this.resourceAddress = resourceAddress;
    this.ids = ids;
    this.intoBucket = intoBucket;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to assert that a specific amount of a specific resource address exists in the
 * worktop.
 */
export class AssertWorktopContains extends Instruction {
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
    super(Kind.AssertWorktopContains);
    this.resourceAddress = resourceAddress;
    this.amount = amount;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to assert that a set ids of a specific resource address exists in the worktop.
 */
export class AssertWorktopContainsNonFungibles extends Instruction {
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
    super(Kind.AssertWorktopContainsNonFungibles);
    this.resourceAddress = resourceAddress;
    this.ids = ids;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to create a proof of the entire amount of a given resource address from the auth
 * zone.
 */
export class CreateProofFromAuthZoneOfAll extends Instruction {
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
    super(Kind.CreateProofFromAuthZoneOfAll);
    this.resourceAddress = resourceAddress;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to create a proof of the an amount of a given resource address from the auth zone.
 */
export class CreateProofFromAuthZoneOfAmount extends Instruction {
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
    super(Kind.CreateProofFromAuthZoneOfAmount);
    this.resourceAddress = resourceAddress;
    this.amount = amount;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to create a proof of the a set of non-fungible ids of a given resource address
 * from the auth zone.
 */
export class CreateProofFromAuthZoneOfNonFungibles extends Instruction {
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
    super(Kind.CreateProofFromAuthZoneOfNonFungibles);
    this.resourceAddress = resourceAddress;
    this.ids = ids;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to create a proof of the entire amount from a bucket.
 */
export class CreateProofFromBucketOfAll extends Instruction {
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
    super(Kind.CreateProofFromBucketOfAll);
    this.bucket = bucket;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to create a proof of the an amount from a bucket.
 */
export class CreateProofFromBucketOfAmount extends Instruction {
  @Expose({ name: "bucket" })
  @Type(() => ManifestAstValue.Bucket)
  bucket: ManifestAstValue.Bucket;

  @Expose({ name: "amount" })
  @Type(() => ManifestAstValue.Decimal)
  amount: ManifestAstValue.Decimal;

  @Expose({ name: "into_proof" })
  @Type(() => ManifestAstValue.Proof)
  intoProof: ManifestAstValue.Proof;

  constructor(
    bucket: ManifestAstValue.Bucket,
    amount: ManifestAstValue.Decimal,
    intoProof: ManifestAstValue.Proof
  ) {
    super(Kind.CreateProofFromBucketOfAmount);
    this.bucket = bucket;
    this.amount = amount;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to create a proof of the a set of non-fungible ids
 * from a bucket.
 */
export class CreateProofFromBucketOfNonFungibles extends Instruction {
  @Expose({ name: "bucket" })
  @Type(() => ManifestAstValue.Bucket)
  bucket: ManifestAstValue.Bucket;

  @Expose({ name: "ids" })
  @Type(() => ManifestAstValue.NonFungibleLocalId)
  ids: Array<ManifestAstValue.NonFungibleLocalId>;

  @Expose({ name: "into_proof" })
  @Type(() => ManifestAstValue.Proof)
  intoProof: ManifestAstValue.Proof;

  constructor(
    bucket: ManifestAstValue.Bucket,
    ids: Array<ManifestAstValue.NonFungibleLocalId>,
    intoProof: ManifestAstValue.Proof
  ) {
    super(Kind.CreateProofFromBucketOfNonFungibles);
    this.bucket = bucket;
    this.ids = ids;
    this.intoProof = intoProof;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
  @Type(() => ManifestAstValue.Bytes)
  schema: ManifestAstValue.Bytes;

  @Expose({ name: "royalty_config" })
  @Type(() => ManifestAstValue.Map)
  royaltyConfig: ManifestAstValue.Map;

  @Expose({ name: "metadata" })
  @Type(() => ManifestAstValue.Map)
  metadata: ManifestAstValue.Map;

  constructor(
    code: ManifestAstValue.Blob,
    schema: ManifestAstValue.Bytes,
    royaltyConfig: ManifestAstValue.Map,
    metadata: ManifestAstValue.Map
  ) {
    super(Kind.PublishPackage);
    this.code = code;
    this.schema = schema;
    this.royaltyConfig = royaltyConfig;
    this.metadata = metadata;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to publish a package and set it's associated royalty configs, metadata, and access
 * rules.
 */
export class PublishPackageAdvanced extends Instruction {
  @Expose({ name: "code" })
  @Type(() => ManifestAstValue.Blob)
  code: ManifestAstValue.Blob;

  @Expose({ name: "schema" })
  @Type(() => ManifestAstValue.Bytes)
  schema: ManifestAstValue.Bytes;

  @Expose({ name: "royalty_config" })
  @Type(() => ManifestAstValue.Map)
  royaltyConfig: ManifestAstValue.Map;

  @Expose({ name: "metadata" })
  @Type(() => ManifestAstValue.Map)
  metadata: ManifestAstValue.Map;

  @Expose({ name: "authority_rules" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  authorityRules: ManifestAstValue.Value;

  constructor(
    code: ManifestAstValue.Blob,
    schema: ManifestAstValue.Bytes,
    royaltyConfig: ManifestAstValue.Map,
    metadata: ManifestAstValue.Map,
    authorityRules: ManifestAstValue.Value
  ) {
    super(Kind.PublishPackageAdvanced);
    this.code = code;
    this.schema = schema;
    this.royaltyConfig = royaltyConfig;
    this.metadata = metadata;
    this.authorityRules = authorityRules;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction ot recall resources from a known vault.
 */
export class RecallResource extends Instruction {
  @Expose({ name: "vault_id" })
  @Type(() => ManifestAstValue.Address)
  vaultId: ManifestAstValue.Address;

  @Expose({ name: "amount" })
  @Type(() => ManifestAstValue.Decimal)
  amount: ManifestAstValue.Decimal;

  constructor(
    vaultId: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal
  ) {
    super(Kind.RecallResource);
    this.vaultId = vaultId;
    this.amount = amount;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to modify the access rules of a method that an entity has.
 */
export class SetAuthorityAccessRule extends Instruction {
  @Expose({ name: "entity_address" })
  @Type(() => ManifestAstValue.Address)
  entityAddress: ManifestAstValue.Address;

  @Expose({ name: "object_key" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  objectKey: ManifestAstValue.Value;

  @Expose({ name: "authority_key" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  authorityKey: ManifestAstValue.Value;

  @Expose({ name: "rule" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  rule: ManifestAstValue.Value;

  constructor(
    entityAddress: ManifestAstValue.Address,
    objectKey: ManifestAstValue.Value,
    authorityKey: ManifestAstValue.Value,
    rule: ManifestAstValue.Value
  ) {
    super(Kind.SetAuthorityAccessRule);
    this.entityAddress = entityAddress;
    this.objectKey = objectKey;
    this.authorityKey = authorityKey;
    this.rule = rule;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * An instruction to modify the access rules of a method that an entity has.
 */
export class SetAuthorityMutability extends Instruction {
  @Expose({ name: "entity_address" })
  @Type(() => ManifestAstValue.Address)
  entityAddress: ManifestAstValue.Address;

  @Expose({ name: "object_key" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  objectKey: ManifestAstValue.Value;

  @Expose({ name: "authority_key" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  authorityKey: ManifestAstValue.Value;

  @Expose({ name: "mutability" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  mutability: ManifestAstValue.Value;

  constructor(
    entityAddress: ManifestAstValue.Address,
    objectKey: ManifestAstValue.Value,
    authorityKey: ManifestAstValue.Value,
    mutability: ManifestAstValue.Value
  ) {
    super(Kind.SetAuthorityMutability);
    this.entityAddress = entityAddress;
    this.objectKey = objectKey;
    this.authorityKey = authorityKey;
    this.mutability = mutability;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
  @Type(() => ManifestAstValue.Tuple)
  schema: ManifestAstValue.Tuple;

  @Expose({ name: "metadata" })
  @Type(() => ManifestAstValue.Map)
  metadata: ManifestAstValue.Map;

  @Expose({ name: "access_rules" })
  @Type(() => ManifestAstValue.Map)
  accessRules: ManifestAstValue.Map;

  @Expose({ name: "initial_supply" })
  @Type(() => ManifestAstValue.Value, manifestAstValueTypeOptions)
  initialSupply: ManifestAstValue.Value;

  constructor(
    idType: ManifestAstValue.Enum,
    schema: ManifestAstValue.Tuple,
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
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
      property: "kind",
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * Creates a new identity native component with the passed access rule.
 */
export class CreateIdentity extends Instruction {
  constructor() {
    super(Kind.CreateIdentity);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * Creates a new identity native component with the passed access rule.
 */
export class CreateIdentityAdvanced extends Instruction {
  @Expose({ name: "config" })
  @Type(() => ManifestAstValue.Tuple)
  config: ManifestAstValue.Tuple;

  constructor(config: ManifestAstValue.Tuple) {
    super(Kind.CreateIdentityAdvanced);
    this.config = config;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * Creates a validator given the public key of the owner who controls it
 */
export class CreateValidator extends Instruction {
  @Expose({ name: "key" })
  @Type(() => ManifestAstValue.Bytes)
  key: ManifestAstValue.Bytes;

  constructor(key: ManifestAstValue.Bytes) {
    super(Kind.CreateValidator);
    this.key = key;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * Creates a new global account component which has the withdraw rule seen in the rule.
 */
export class CreateAccount extends Instruction {
  constructor() {
    super(Kind.CreateAccount);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * Creates a new global account component which has the withdraw rule seen in the rule.
 */
export class CreateAccountAdvanced extends Instruction {
  @Expose({ name: "config" })
  @Type(() => ManifestAstValue.Tuple)
  config: ManifestAstValue.Tuple;

  constructor(config: ManifestAstValue.Tuple) {
    super(Kind.CreateAccountAdvanced);
    this.config = config;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
