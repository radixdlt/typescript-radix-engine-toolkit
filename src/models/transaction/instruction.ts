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
import { serialize } from "../../utils";

export type Instruction =
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
  private _instruction: Kind = Kind.CallFunction;
  private _packageAddress: ManifestAstValue.Address;
  private _blueprintName: ManifestAstValue.String;
  private _functionName: ManifestAstValue.String;
  private _arguments: Array<ManifestAstValue.Any> | null;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the package containing the blueprint that contains the desired function. This
   * package address is serialized as the `PackageAddress` variant of the `ManifestAstValue` model.
   */
  public get packageAddress() {
    return this._packageAddress;
  }
  /**
   * The address of the package containing the blueprint that contains the desired function. This
   * package address is serialized as the `PackageAddress` variant of the `ManifestAstValue` model.
   */
  public set packageAddress(value: ManifestAstValue.Address) {
    this._packageAddress = value;
  }

  /**
   * A string of the name of the blueprint containing the desired function. This field is serialized
   * as a `String` from the ManifestAstValue model.
   */
  public get blueprintName() {
    return this._blueprintName;
  }
  /**
   * A string of the name of the blueprint containing the desired function. This field is serialized
   * as a `String` from the ManifestAstValue model.
   */
  public set blueprintName(value: ManifestAstValue.String) {
    this._blueprintName = value;
  }

  /**
   * A string of the name of the function to call. This field is serialized as a `String` from the
   * ManifestAstValue model.
   */
  public get functionName() {
    return this._functionName;
  }
  /**
   * A string of the name of the function to call. This field is serialized as a `String` from the
   * ManifestAstValue model.
   */
  public set functionName(value: ManifestAstValue.String) {
    this._functionName = value;
  }

  /**
   * An optional array of `ManifestAstValue` arguments to call the function with. If this array is
   * empty or is not provided, then the function is called with no arguments.
   */
  public get arguments() {
    return this._arguments;
  }
  /**
   * An optional array of `ManifestAstValue` arguments to call the function with. If this array is
   * empty or is not provided, then the function is called with no arguments.
   */
  public set arguments(value: Array<ManifestAstValue.Any> | null) {
    this._arguments = value;
  }

  constructor(
    packageAddress: ManifestAstValue.Address,
    blueprintName: ManifestAstValue.String,
    functionName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Any> | null = null
  ) {
    this._packageAddress = packageAddress;
    this._blueprintName = blueprintName;
    this._functionName = functionName;
    this._arguments = args;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to call a method with a given name on a given component address with the given
 * list of arguments.
 */
export class CallMethod {
  private _instruction: Kind = Kind.CallMethod;
  private _componentAddress: ManifestAstValue.Address;
  private _methodName: ManifestAstValue.String;
  private _arguments: Array<ManifestAstValue.Any> | null;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the component which contains the method to be invoked. This field is serialized
   * as a `ComponentAddress` from the ManifestAstValue model.
   */
  public get componentAddress() {
    return this._componentAddress;
  }
  /**
   * The address of the component which contains the method to be invoked. This field is serialized
   * as a `ComponentAddress` from the ManifestAstValue model.
   */
  public set componentAddress(value: ManifestAstValue.Address) {
    this._componentAddress = value;
  }

  /**
   * A string of the name of the method to call. his field is serialized as a `String` from the
   * ManifestAstValue model.
   */
  public get methodName() {
    return this._methodName;
  }
  /**
   * A string of the name of the method to call. his field is serialized as a `String` from the
   * ManifestAstValue model.
   */
  public set methodName(value: ManifestAstValue.String) {
    this._methodName = value;
  }

  /**
   * An optional array of `ManifestAstValue` arguments to call the method with. If this array is
   * empty or is not provided, then the method is called with no arguments.
   */
  public get arguments() {
    return this._arguments;
  }
  /**
   * An optional array of `ManifestAstValue` arguments to call the method with. If this array is
   * empty or is not provided, then the method is called with no arguments.
   */
  public set arguments(value: Array<ManifestAstValue.Any> | null) {
    this._arguments = value;
  }

  constructor(
    componentAddress: ManifestAstValue.Address,
    methodName: ManifestAstValue.String,
    args: Array<ManifestAstValue.Any> | null = null
  ) {
    this._componentAddress = componentAddress;
    this._methodName = methodName;
    this._arguments = args;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to take the entire amount of a given resource address from the worktop and put it
 * in a bucket.
 */
export class TakeFromWorktop {
  private _instruction: Kind = Kind.TakeFromWorktop;
  private _resourceAddress: ManifestAstValue.Address;
  private _intoBucket: ManifestAstValue.Bucket;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to take from the worktop. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to take from the worktop. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * A bucket to put the taken resources into. This field is serialized as a `Bucket` from the
   * ManifestAstValue model.
   */
  public get intoBucket() {
    return this._intoBucket;
  }
  /**
   * A bucket to put the taken resources into. This field is serialized as a `Bucket` from the
   * ManifestAstValue model.
   */
  public set intoBucket(value: ManifestAstValue.Bucket) {
    this._intoBucket = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    intoBucket: ManifestAstValue.Bucket
  ) {
    this._resourceAddress = resourceAddress;
    this._intoBucket = intoBucket;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to take the an amount of a given resource address from the worktop and put it in a
 * bucket.
 */
export class TakeFromWorktopByAmount {
  private _instruction: Kind = Kind.TakeFromWorktopByAmount;
  private _resourceAddress: ManifestAstValue.Address;
  private _amount: ManifestAstValue.Decimal;
  private _intoBucket: ManifestAstValue.Bucket;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to take from the worktop. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to take from the worktop. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * The amount of the resource to take from the worktop. This field is serialized as a `Decimal`
   * from the ManifestAstValue model.
   */
  public get amount() {
    return this._amount;
  }
  /**
   * The amount of the resource to take from the worktop. This field is serialized as a `Decimal`
   * from the ManifestAstValue model.
   */
  public set amount(value: ManifestAstValue.Decimal) {
    this._amount = value;
  }

  /**
   * A bucket to put the taken resources into. This field is serialized as a `Bucket` from the
   * ManifestAstValue model.
   */
  public get intoBucket() {
    return this._intoBucket;
  }
  /**
   * A bucket to put the taken resources into. This field is serialized as a `Bucket` from the
   * ManifestAstValue model.
   */
  public set intoBucket(value: ManifestAstValue.Bucket) {
    this._intoBucket = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal,
    intoBucket: ManifestAstValue.Bucket
  ) {
    this._resourceAddress = resourceAddress;
    this._amount = amount;
    this._intoBucket = intoBucket;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to take the a set of non-fungible ids of a given resource address from the worktop
 * and put it in a bucket.
 */
export class TakeFromWorktopByIds {
  private _instruction: Kind = Kind.TakeFromWorktopByIds;
  private _resourceAddress: ManifestAstValue.Address;
  private _ids: Array<ManifestAstValue.NonFungibleLocalId>;
  private _intoBucket: ManifestAstValue.Bucket;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to take from the worktop. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to take from the worktop. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * The non-fungible ids to take from the worktop. This is a set (serialized as a JSON array) of
   * `NonFungibleLocalId`s from the ManifestAstValue model.
   */
  public get ids() {
    return this._ids;
  }
  /**
   * The non-fungible ids to take from the worktop. This is a set (serialized as a JSON array) of
   * `NonFungibleLocalId`s from the ManifestAstValue model.
   */
  public set ids(value: Array<ManifestAstValue.NonFungibleLocalId>) {
    this._ids = value;
  }

  /**
   * A bucket to put the taken resources into. This field is serialized as a `Bucket` from the
   * ManifestAstValue model.
   */
  public get intoBucket() {
    return this._intoBucket;
  }
  /**
   * A bucket to put the taken resources into. This field is serialized as a `Bucket` from the
   * ManifestAstValue model.
   */
  public set intoBucket(value: ManifestAstValue.Bucket) {
    this._intoBucket = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    ids: Array<ManifestAstValue.NonFungibleLocalId>,
    intoBucket: ManifestAstValue.Bucket
  ) {
    this._resourceAddress = resourceAddress;
    this._ids = ids;
    this._intoBucket = intoBucket;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * Returns a bucket of tokens to the worktop.
 */
export class ReturnToWorktop {
  private _instruction: Kind = Kind.ReturnToWorktop;
  private _bucket: ManifestAstValue.Bucket;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The bucket to return to the worktop.
   */
  public get bucket() {
    return this._bucket;
  }
  /**
   * The bucket to return to the worktop.
   */
  public set bucket(value: ManifestAstValue.Bucket) {
    this._bucket = value;
  }

  constructor(bucket: ManifestAstValue.Bucket) {
    this._bucket = bucket;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to assert that a given resource exists in the worktop.
 */
export class AssertWorktopContains {
  private _instruction: Kind = Kind.AssertWorktopContains;
  private _resourceAddress: ManifestAstValue.Address;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to perform the assertion on. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to perform the assertion on. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  constructor(resourceAddress: ManifestAstValue.Address) {
    this._resourceAddress = resourceAddress;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to assert that a specific amount of a specific resource address exists in the
 * worktop.
 */
export class AssertWorktopContainsByAmount {
  private _instruction: Kind = Kind.AssertWorktopContainsByAmount;
  private _resourceAddress: ManifestAstValue.Address;
  private _amount: ManifestAstValue.Decimal;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to perform the assertion on. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to perform the assertion on. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * The amount of the resource to assert their existence in the worktop. This field is serialized
   * as a `Decimal` from the ManifestAstValue model.
   */
  public get amount() {
    return this._amount;
  }
  /**
   * The amount of the resource to assert their existence in the worktop. This field is serialized
   * as a `Decimal` from the ManifestAstValue model.
   */
  public set amount(value: ManifestAstValue.Decimal) {
    this._amount = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal
  ) {
    this._resourceAddress = resourceAddress;
    this._amount = amount;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to assert that a set ids of a specific resource address exists in the worktop.
 */
export class AssertWorktopContainsByIds {
  private _instruction: Kind = Kind.AssertWorktopContainsByIds;
  private _resourceAddress: ManifestAstValue.Address;
  private _ids: Array<ManifestAstValue.NonFungibleLocalId>;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to perform the assertion on. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to perform the assertion on. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * The non-fungible ids of the resource to assert their existence in the worktop. This is a set
   * (serialized as a JSON array) of `NonFungibleLocalId`s from the ManifestAstValue model.
   */
  public get ids() {
    return this._ids;
  }
  /**
   * The non-fungible ids of the resource to assert their existence in the worktop. This is a set
   * (serialized as a JSON array) of `NonFungibleLocalId`s from the ManifestAstValue model.
   */
  public set ids(value: Array<ManifestAstValue.NonFungibleLocalId>) {
    this._ids = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    ids: Array<ManifestAstValue.NonFungibleLocalId>
  ) {
    this._resourceAddress = resourceAddress;
    this._ids = ids;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction which pops a proof from the AuthZone stack and into an identifiable proof
 */
export class PopFromAuthZone {
  private _instruction: Kind = Kind.PopFromAuthZone;
  private _intoProof: ManifestAstValue.Proof;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The proof to put the popped proof into. This is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public get intoProof() {
    return this._intoProof;
  }
  /**
   * The proof to put the popped proof into. This is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public set intoProof(value: ManifestAstValue.Proof) {
    this._intoProof = value;
  }

  constructor(intoProof: ManifestAstValue.Proof) {
    this._intoProof = intoProof;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction that pushes a proof to the auth zone stack.
 */
export class PushToAuthZone {
  private _instruction: Kind = Kind.PushToAuthZone;
  private _proof: ManifestAstValue.Proof;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The proof to push to the auth zone stack. This is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public get proof() {
    return this._proof;
  }
  /**
   * The proof to push to the auth zone stack. This is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public set proof(value: ManifestAstValue.Proof) {
    this._proof = value;
  }

  constructor(proof: ManifestAstValue.Proof) {
    this._proof = proof;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction which clears the auth zone stack by dropping all of the proofs in that stack.
 */
export class ClearAuthZone {
  private _instruction: Kind = Kind.ClearAuthZone;

  public get instruction(): Kind {
    return this._instruction;
  }
  constructor() {}
}

/**
 * Clears all the proofs of signature virtual badges.
 */
export class ClearSignatureProofs {
  private _instruction: Kind = Kind.ClearSignatureProofs;

  public get instruction(): Kind {
    return this._instruction;
  }
  constructor() {}
}

/**
 * An instruction to create a proof of the entire amount of a given resource address from the auth
 * zone.
 */
export class CreateProofFromAuthZone {
  private _instruction: Kind = Kind.CreateProofFromAuthZone;
  private _resourceAddress: ManifestAstValue.Address;
  private _intoProof: ManifestAstValue.Proof;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to create a proof of. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to create a proof of. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * A proof to put the resource proof into. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public get intoProof() {
    return this._intoProof;
  }
  /**
   * A proof to put the resource proof into. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public set intoProof(value: ManifestAstValue.Proof) {
    this._intoProof = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    intoProof: ManifestAstValue.Proof
  ) {
    this._resourceAddress = resourceAddress;
    this._intoProof = intoProof;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to create a proof of the an amount of a given resource address from the auth zone.
 */
export class CreateProofFromAuthZoneByAmount {
  private _instruction: Kind = Kind.CreateProofFromAuthZoneByAmount;
  private _resourceAddress: ManifestAstValue.Address;
  private _amount: ManifestAstValue.Decimal;
  private _intoProof: ManifestAstValue.Proof;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to create a proof of. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to create a proof of. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * The amount of the resource to create a proof of. This field is serialized as a `Decimal` from
   * the ManifestAstValue model.
   */
  public get amount() {
    return this._amount;
  }
  /**
   * The amount of the resource to create a proof of. This field is serialized as a `Decimal` from
   * the ManifestAstValue model.
   */
  public set amount(value: ManifestAstValue.Decimal) {
    this._amount = value;
  }

  /**
   * A proof to put the resource proof into. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public get intoProof() {
    return this._intoProof;
  }
  /**
   * A proof to put the resource proof into. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public set intoProof(value: ManifestAstValue.Proof) {
    this._intoProof = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal,
    intoProof: ManifestAstValue.Proof
  ) {
    this._resourceAddress = resourceAddress;
    this._amount = amount;
    this._intoProof = intoProof;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to create a proof of the a set of non-fungible ids of a given resource address
 * from the auth zone.
 */
export class CreateProofFromAuthZoneByIds {
  private _instruction: Kind = Kind.CreateProofFromAuthZoneByIds;
  private _resourceAddress: ManifestAstValue.Address;
  private _ids: Array<ManifestAstValue.NonFungibleLocalId>;
  private _intoProof: ManifestAstValue.Proof;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to create a proof of. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to create a proof of. This field is serialized as a
   * `ResourceAddress` from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * The non-fungible ids to create a proof of. This is a set (serialized as a JSON array) of
   * `NonFungibleLocalId`s from the ManifestAstValue model.
   */
  public get ids() {
    return this._ids;
  }
  /**
   * The non-fungible ids to create a proof of. This is a set (serialized as a JSON array) of
   * `NonFungibleLocalId`s from the ManifestAstValue model.
   */
  public set ids(value: Array<ManifestAstValue.NonFungibleLocalId>) {
    this._ids = value;
  }

  /**
   * A proof to put the resource proof into. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public get intoProof() {
    return this._intoProof;
  }
  /**
   * A proof to put the resource proof into. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public set intoProof(value: ManifestAstValue.Proof) {
    this._intoProof = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    ids: Array<ManifestAstValue.NonFungibleLocalId>,
    intoProof: ManifestAstValue.Proof
  ) {
    this._resourceAddress = resourceAddress;
    this._ids = ids;
    this._intoProof = intoProof;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to create a proof given a bucket of some resources
 */
export class CreateProofFromBucket {
  private _instruction: Kind = Kind.CreateProofFromBucket;
  private _bucket: ManifestAstValue.Bucket;
  private _intoProof: ManifestAstValue.Proof;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The bucket of resources to create a proof from. This field is serialized as a `Bucket` from the
   * ManifestAstValue model.
   */
  public get bucket() {
    return this._bucket;
  }
  /**
   * The bucket of resources to create a proof from. This field is serialized as a `Bucket` from the
   * ManifestAstValue model.
   */
  public set bucket(value: ManifestAstValue.Bucket) {
    this._bucket = value;
  }

  /**
   * The proof variable that the proof should go to. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public get intoProof() {
    return this._intoProof;
  }
  /**
   * The proof variable that the proof should go to. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public set intoProof(value: ManifestAstValue.Proof) {
    this._intoProof = value;
  }

  constructor(
    bucket: ManifestAstValue.Bucket,
    intoProof: ManifestAstValue.Proof
  ) {
    this._bucket = bucket;
    this._intoProof = intoProof;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to clone a proof creating a second proof identical to the original
 */
export class CloneProof {
  private _instruction: Kind = Kind.CloneProof;
  private _proof: ManifestAstValue.Proof;
  private _intoProof: ManifestAstValue.Proof;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The original proof, or the proof to be cloned. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public get proof() {
    return this._proof;
  }
  /**
   * The original proof, or the proof to be cloned. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public set proof(value: ManifestAstValue.Proof) {
    this._proof = value;
  }

  /**
   * The proof variable that the proof should go to. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public get intoProof() {
    return this._intoProof;
  }
  /**
   * The proof variable that the proof should go to. This field is serialized as a `Proof` from the
   * ManifestAstValue model.
   */
  public set intoProof(value: ManifestAstValue.Proof) {
    this._intoProof = value;
  }

  constructor(
    proof: ManifestAstValue.Proof,
    intoProof: ManifestAstValue.Proof
  ) {
    this._proof = proof;
    this._intoProof = intoProof;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to drop a proof.
 */
export class DropProof {
  private _instruction: Kind = Kind.DropProof;
  private _proof: ManifestAstValue.Proof;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The proof to drop. This field is serialized as a `Proof` from the ManifestAstValue model.
   */
  public get proof() {
    return this._proof;
  }
  /**
   * The proof to drop. This field is serialized as a `Proof` from the ManifestAstValue model.
   */
  public set proof(value: ManifestAstValue.Proof) {
    this._proof = value;
  }

  constructor(proof: ManifestAstValue.Proof) {
    this._proof = proof;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to drop all proofs currently present in the transaction context.
 */
export class DropAllProofs {
  private _instruction: Kind = Kind.DropAllProofs;

  public get instruction(): Kind {
    return this._instruction;
  }
  constructor() {}
}

/**
 * An instruction to publish a package and set it's associated royalty configs, metadata, and access
 * rules.
 */
export class PublishPackage {
  private _instruction: Kind = Kind.PublishPackage;
  private _code: ManifestAstValue.Blob;
  private _schema: ManifestAstValue.Blob;
  private _royaltyConfig: ManifestAstValue.Tuple;
  private _metadata: ManifestAstValue.Map;
  private _accessRules: ManifestAstValue.Any;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The blob of the package code. This field is serialized as a `Blob` from the ManifestAstValue
   * model.
   */
  public get code() {
    return this._code;
  }
  /**
   * The blob of the package code. This field is serialized as a `Blob` from the ManifestAstValue
   * model.
   */
  public set code(value: ManifestAstValue.Blob) {
    this._code = value;
  }

  /**
   * The blob of the package ABI. This field is serialized as a `Blob` from the ManifestAstValue
   * model.
   */
  public get schema() {
    return this._schema;
  }
  /**
   * The blob of the package ABI. This field is serialized as a `Blob` from the ManifestAstValue
   * model.
   */
  public set schema(value: ManifestAstValue.Blob) {
    this._schema = value;
  }

  /**
   * The configurations of the royalty for the package. The underlying type of this is a Map where
   * the key is a string of the blueprint name and the value is a `RoyaltyConfig`. This is
   * serialized as an `Map` from the ManifestAstValue model.
   */
  public get royaltyConfig() {
    return this._royaltyConfig;
  }
  /**
   * The configurations of the royalty for the package. The underlying type of this is a Map where
   * the key is a string of the blueprint name and the value is a `RoyaltyConfig`. This is
   * serialized as an `Map` from the ManifestAstValue model.
   */
  public set royaltyConfig(value: ManifestAstValue.Tuple) {
    this._royaltyConfig = value;
  }

  /**
   * The metadata to use for the package. The underlying type of this is a string-string Map of the
   * metadata. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public get metadata() {
    return this._metadata;
  }
  /**
   * The metadata to use for the package. The underlying type of this is a string-string Map of the
   * metadata. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public set metadata(value: ManifestAstValue.Map) {
    this._metadata = value;
  }

  /**
   * The access rules to use for the package. This is serialized as a `Tuple` from the
   * ManifestAstValue model.
   */
  public get accessRules() {
    return this._accessRules;
  }
  /**
   * The access rules to use for the package. This is serialized as a `Tuple` from the
   * ManifestAstValue model.
   */
  public set accessRules(value: ManifestAstValue.Any) {
    this._accessRules = value;
  }

  constructor(
    code: ManifestAstValue.Blob,
    schema: ManifestAstValue.Blob,
    royaltyConfig: ManifestAstValue.Tuple,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Any
  ) {
    this._code = code;
    this._schema = schema;
    this._royaltyConfig = royaltyConfig;
    this._metadata = metadata;
    this._accessRules = accessRules;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to burn a bucket of tokens.
 */
export class BurnResource {
  private _instruction: Kind = Kind.BurnResource;
  private _bucket: ManifestAstValue.Bucket;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The bucket of tokens to burn.
   */
  public get bucket() {
    return this._bucket;
  }
  /**
   * The bucket of tokens to burn.
   */
  public set bucket(value: ManifestAstValue.Bucket) {
    this._bucket = value;
  }

  constructor(bucket: ManifestAstValue.Bucket) {
    this._bucket = bucket;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction ot recall resources from a known vault.
 */
export class RecallResource {
  private _instruction: Kind = Kind.RecallResource;
  private _vaultId: ManifestAstValue.Bytes;
  private _amount: ManifestAstValue.Decimal;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The id of the vault of the tokens to recall. This field is serialized as an `Own` from the
   * value model and is expected to be an `Own::Vault`.
   */
  public get vaultId() {
    return this._vaultId;
  }
  /**
   * The id of the vault of the tokens to recall. This field is serialized as an `Own` from the
   * value model and is expected to be an `Own::Vault`.
   */
  public set vaultId(value: ManifestAstValue.Bytes) {
    this._vaultId = value;
  }

  /**
   * The amount of tokens to recall from the vault. This field is serialized as a `Decimal` field
   * from the ManifestAstValue model.
   */
  public get amount() {
    return this._amount;
  }
  /**
   * The amount of tokens to recall from the vault. This field is serialized as a `Decimal` field
   * from the ManifestAstValue model.
   */
  public set amount(value: ManifestAstValue.Decimal) {
    this._amount = value;
  }

  constructor(
    vaultId: ManifestAstValue.Bytes,
    amount: ManifestAstValue.Decimal
  ) {
    this._vaultId = vaultId;
    this._amount = amount;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to set the metadata on an entity.
 */
export class SetMetadata {
  private _instruction: Kind = Kind.SetMetadata;
  private _entityAddress: ManifestAstValue.Address;
  private _key: ManifestAstValue.String;
  private _value: ManifestAstValue.Enum;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the entity to set metadata on. This is a discriminated union of types where it
   * can either be a `ResourceAddress`, `ComponentAddress`, `PackageAddress` or a
   * `ComponentAddress`.
   */
  public get entityAddress() {
    return this._entityAddress;
  }
  /**
   * The address of the entity to set metadata on. This is a discriminated union of types where it
   * can either be a `ResourceAddress`, `ComponentAddress`, `PackageAddress` or a
   * `ComponentAddress`.
   */
  public set entityAddress(value: ManifestAstValue.Address) {
    this._entityAddress = value;
  }

  /**
   * A string of the key to set the metadata for. This field is serialized as a `String` from the
   * ManifestAstValue model.
   */
  public get key() {
    return this._key;
  }
  /**
   * A string of the key to set the metadata for. This field is serialized as a `String` from the
   * ManifestAstValue model.
   */
  public set key(value: ManifestAstValue.String) {
    this._key = value;
  }

  /**
   * A string of the value to set the metadata for. This field is serialized as a `String` from the
   * ManifestAstValue model.
   */
  public get value() {
    return this._value;
  }
  /**
   * A string of the value to set the metadata for. This field is serialized as a `String` from the
   * ManifestAstValue model.
   */
  public set value(value: ManifestAstValue.Enum) {
    this._value = value;
  }

  constructor(
    entityAddress: ManifestAstValue.Address,
    key: ManifestAstValue.String,
    value: ManifestAstValue.Enum
  ) {
    this._entityAddress = entityAddress;
    this._key = key;
    this._value = value;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to set the metadata on an entity.
 */
export class RemoveMetadata {
  private _instruction: Kind = Kind.RemoveMetadata;
  private _entityAddress: ManifestAstValue.Address;
  private _key: ManifestAstValue.String;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the entity to set metadata on. This is a discriminated union of types where it
   * can either be a `ResourceAddress`, `ComponentAddress`, `PackageAddress` or a
   * `ComponentAddress`.
   */
  public get entityAddress() {
    return this._entityAddress;
  }
  /**
   * The address of the entity to set metadata on. This is a discriminated union of types where it
   * can either be a `ResourceAddress`, `ComponentAddress`, `PackageAddress` or a
   * `ComponentAddress`.
   */
  public set entityAddress(value: ManifestAstValue.Address) {
    this._entityAddress = value;
  }

  /**
   * A string of the key to remove the metadata for. This field is serialized as a `String` from the
   * ManifestAstValue model.
   */
  public get key() {
    return this._key;
  }
  /**
   * A string of the key to remove the metadata for. This field is serialized as a `String` from the
   * ManifestAstValue model.
   */
  public set key(value: ManifestAstValue.String) {
    this._key = value;
  }

  constructor(
    entityAddress: ManifestAstValue.Address,
    key: ManifestAstValue.String
  ) {
    this._entityAddress = entityAddress;
    this._key = key;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to modify the royalties of a package.
 */
export class SetPackageRoyaltyConfig {
  private _instruction: Kind = Kind.SetPackageRoyaltyConfig;
  private _packageAddress: ManifestAstValue.Address;
  private _royaltyConfig: ManifestAstValue.Map;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the package to set the royalty on. This is serialized as a `PackageAddress` from
   * the ManifestAstValue model.
   */
  public get packageAddress() {
    return this._packageAddress;
  }
  /**
   * The address of the package to set the royalty on. This is serialized as a `PackageAddress` from
   * the ManifestAstValue model.
   */
  public set packageAddress(value: ManifestAstValue.Address) {
    this._packageAddress = value;
  }

  /**
   * The configurations of the royalty for the package. The underlying type of this is a Map where
   * the key is a string of the blueprint name and the value is a `RoyaltyConfig`. This is
   * serialized as an `Map` from the ManifestAstValue model.
   */
  public get royaltyConfig() {
    return this._royaltyConfig;
  }
  /**
   * The configurations of the royalty for the package. The underlying type of this is a Map where
   * the key is a string of the blueprint name and the value is a `RoyaltyConfig`. This is
   * serialized as an `Map` from the ManifestAstValue model.
   */
  public set royaltyConfig(value: ManifestAstValue.Map) {
    this._royaltyConfig = value;
  }

  constructor(
    packageAddress: ManifestAstValue.Address,
    royaltyConfig: ManifestAstValue.Map
  ) {
    this._packageAddress = packageAddress;
    this._royaltyConfig = royaltyConfig;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to modify the royalties on a component
 */
export class SetComponentRoyaltyConfig {
  private _instruction: Kind = Kind.SetComponentRoyaltyConfig;
  private _componentAddress: ManifestAstValue.Address;
  private _royaltyConfig: ManifestAstValue.Tuple;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The component address of the component to modify royalties for. This field is serialized as a
   * `ComponentAddress` from the ManifestAstValue model.
   */
  public get componentAddress() {
    return this._componentAddress;
  }
  /**
   * The component address of the component to modify royalties for. This field is serialized as a
   * `ComponentAddress` from the ManifestAstValue model.
   */
  public set componentAddress(value: ManifestAstValue.Address) {
    this._componentAddress = value;
  }

  /**
   * The royalty config to set on the component. This is an `Enum` from the `ManifestAstValue`
   * model.
   */
  public get royaltyConfig() {
    return this._royaltyConfig;
  }
  /**
   * The royalty config to set on the component. This is an `Enum` from the `ManifestAstValue`
   * model.
   */
  public set royaltyConfig(value: ManifestAstValue.Tuple) {
    this._royaltyConfig = value;
  }

  constructor(
    componentAddress: ManifestAstValue.Address,
    royaltyConfig: ManifestAstValue.Tuple
  ) {
    this._componentAddress = componentAddress;
    this._royaltyConfig = royaltyConfig;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to claim royalties of a package
 */
export class ClaimPackageRoyalty {
  private _instruction: Kind = Kind.ClaimPackageRoyalty;
  private _packageAddress: ManifestAstValue.Address;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The package address of the package to claim royalties for. This field is serialized as a
   * `PackageAddress` from the ManifestAstValue model.
   */
  public get packageAddress() {
    return this._packageAddress;
  }
  /**
   * The package address of the package to claim royalties for. This field is serialized as a
   * `PackageAddress` from the ManifestAstValue model.
   */
  public set packageAddress(value: ManifestAstValue.Address) {
    this._packageAddress = value;
  }

  constructor(packageAddress: ManifestAstValue.Address) {
    this._packageAddress = packageAddress;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to claim royalties of a component
 */
export class ClaimComponentRoyalty {
  private _instruction: Kind = Kind.ClaimComponentRoyalty;
  private _componentAddress: ManifestAstValue.Address;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The component address of the component to claim royalties for. This field is serialized as a
   * `ComponentAddress` from the ManifestAstValue model.
   */
  public get componentAddress() {
    return this._componentAddress;
  }
  /**
   * The component address of the component to claim royalties for. This field is serialized as a
   * `ComponentAddress` from the ManifestAstValue model.
   */
  public set componentAddress(value: ManifestAstValue.Address) {
    this._componentAddress = value;
  }

  constructor(componentAddress: ManifestAstValue.Address) {
    this._componentAddress = componentAddress;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to modify the access rules of a method that an entity has.
 */
export class SetMethodAccessRule {
  private _instruction: Kind = Kind.SetMethodAccessRule;
  private _entityAddress: ManifestAstValue.Address;
  private _key: ManifestAstValue.String;
  private _rule: ManifestAstValue.Enum;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The entity address of the entity to modify the access rules for.
   */
  public get entityAddress() {
    return this._entityAddress;
  }
  /**
   * The entity address of the entity to modify the access rules for.
   */
  public set entityAddress(value: ManifestAstValue.Address) {
    this._entityAddress = value;
  }

  /**
   * The method key for the method to set the access rule of. This field is serialized as an `Enum`
   * from the ManifestAstValue model
   */
  public get key() {
    return this._key;
  }
  /**
   * The method key for the method to set the access rule of. This field is serialized as an `Enum`
   * from the ManifestAstValue model
   */
  public set key(value: ManifestAstValue.String) {
    this._key = value;
  }

  /**
   * The new access rule to set in-place of the old one. This field is serialized as an `Enum` from
   * the ManifestAstValue model
   */
  public get rule() {
    return this._rule;
  }
  /**
   * The new access rule to set in-place of the old one. This field is serialized as an `Enum` from
   * the ManifestAstValue model
   */
  public set rule(value: ManifestAstValue.Enum) {
    this._rule = value;
  }

  constructor(
    entityAddress: ManifestAstValue.Address,
    key: ManifestAstValue.String,
    rule: ManifestAstValue.Enum
  ) {
    this._entityAddress = entityAddress;
    this._key = key;
    this._rule = rule;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to mint fungible resources
 */
export class MintFungible {
  private _instruction: Kind = Kind.MintFungible;
  private _resourceAddress: ManifestAstValue.Address;
  private _amount: ManifestAstValue.Decimal;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to mint tokens of. This field is serialized as a `ResourceAddress`
   * from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to mint tokens of. This field is serialized as a `ResourceAddress`
   * from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * The amount of fungible tokens to mint of this resource. This field is serialized as a `Decimal`
   * from the ManifestAstValue model.
   */
  public get amount() {
    return this._amount;
  }
  /**
   * The amount of fungible tokens to mint of this resource. This field is serialized as a `Decimal`
   * from the ManifestAstValue model.
   */
  public set amount(value: ManifestAstValue.Decimal) {
    this._amount = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    amount: ManifestAstValue.Decimal
  ) {
    this._resourceAddress = resourceAddress;
    this._amount = amount;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to mint non-fungibles of a resource
 */
export class MintNonFungible {
  private _instruction: Kind = Kind.MintNonFungible;
  private _resourceAddress: ManifestAstValue.Address;
  private _entries: ManifestAstValue.Map;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to mint tokens of. This field is serialized as a `ResourceAddress`
   * from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to mint tokens of. This field is serialized as a `ResourceAddress`
   * from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * The non-fungible tokens to mint. The underlying type of this is a map which maps a
   * `NonFungibleLocalId` to a tuple of two `ManifestAstValue` elements where each element is a
   * struct of the immutable and mutable parts of the non-fungible data.
   */
  public get entries() {
    return this._entries;
  }
  /**
   * The non-fungible tokens to mint. The underlying type of this is a map which maps a
   * `NonFungibleLocalId` to a tuple of two `ManifestAstValue` elements where each element is a
   * struct of the immutable and mutable parts of the non-fungible data.
   */
  public set entries(value: ManifestAstValue.Map) {
    this._entries = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    entries: ManifestAstValue.Map
  ) {
    this._resourceAddress = resourceAddress;
    this._entries = entries;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to mint non-fungibles of a non-fungible resource that uses UUID as the type id and
 * perform auto incrimination of ID.
 */
export class MintUuidNonFungible {
  private _instruction: Kind = Kind.MintUuidNonFungible;
  private _resourceAddress: ManifestAstValue.Address;
  private _entries: ManifestAstValue.Array;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The address of the resource to mint tokens of. This field is serialized as a `ResourceAddress`
   * from the ManifestAstValue model.
   */
  public get resourceAddress() {
    return this._resourceAddress;
  }
  /**
   * The address of the resource to mint tokens of. This field is serialized as a `ResourceAddress`
   * from the ManifestAstValue model.
   */
  public set resourceAddress(value: ManifestAstValue.Address) {
    this._resourceAddress = value;
  }

  /**
   * The non-fungible tokens to mint. The underlying type is a vector of tuples of two
   * `ManifestAstValue` elements where each element is a struct of the immutable and mutable parts
   * of the non-fungible data.
   */
  public get entries() {
    return this._entries;
  }
  /**
   * The non-fungible tokens to mint. The underlying type is a vector of tuples of two
   * `ManifestAstValue` elements where each element is a struct of the immutable and mutable parts
   * of the non-fungible data.
   */
  public set entries(value: ManifestAstValue.Array) {
    this._entries = value;
  }

  constructor(
    resourceAddress: ManifestAstValue.Address,
    entries: ManifestAstValue.Array
  ) {
    this._resourceAddress = resourceAddress;
    this._entries = entries;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to create a new fungible resource.
 */
export class CreateFungibleResource {
  private _instruction: Kind = Kind.CreateFungibleResource;
  private _divisibility: ManifestAstValue.U8;
  private _metadata: ManifestAstValue.Map;
  private _accessRules: ManifestAstValue.Map;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The divisibility of the resource. This field is serialized as a `U8` from the ManifestAstValue
   * model.
   */
  public get divisibility() {
    return this._divisibility;
  }
  /**
   * The divisibility of the resource. This field is serialized as a `U8` from the ManifestAstValue
   * model.
   */
  public set divisibility(value: ManifestAstValue.U8) {
    this._divisibility = value;
  }

  /**
   * The metadata to set on the resource. The underlying type of this is a string-string Map of the
   * metadata. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public get metadata() {
    return this._metadata;
  }
  /**
   * The metadata to set on the resource. The underlying type of this is a string-string Map of the
   * metadata. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public set metadata(value: ManifestAstValue.Map) {
    this._metadata = value;
  }

  /**
   * The access rules to use for the resource. The underlying type of this is a map which maps a
   * `ResourceMethodAuthKey` enum to a tuple of two `AccessRule`s denoting the current behavior and
   * the mutability. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public get accessRules() {
    return this._accessRules;
  }
  /**
   * The access rules to use for the resource. The underlying type of this is a map which maps a
   * `ResourceMethodAuthKey` enum to a tuple of two `AccessRule`s denoting the current behavior and
   * the mutability. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public set accessRules(value: ManifestAstValue.Map) {
    this._accessRules = value;
  }

  constructor(
    divisibility: ManifestAstValue.U8,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map
  ) {
    this._divisibility = divisibility;
    this._metadata = metadata;
    this._accessRules = accessRules;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to create a fungible resource with initial supply
 */
export class CreateFungibleResourceWithInitialSupply {
  private _instruction: Kind = Kind.CreateFungibleResourceWithInitialSupply;
  private _divisibility: ManifestAstValue.U8;
  private _metadata: ManifestAstValue.Map;
  private _accessRules: ManifestAstValue.Map;
  private _initialSupply: ManifestAstValue.Decimal;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The divisibility of the resource. This field is serialized as a `U8` from the ManifestAstValue
   * model.
   */
  public get divisibility() {
    return this._divisibility;
  }
  /**
   * The divisibility of the resource. This field is serialized as a `U8` from the ManifestAstValue
   * model.
   */
  public set divisibility(value: ManifestAstValue.U8) {
    this._divisibility = value;
  }

  /**
   * The metadata to set on the resource. The underlying type of this is a string-string Map of the
   * metadata. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public get metadata() {
    return this._metadata;
  }
  /**
   * The metadata to set on the resource. The underlying type of this is a string-string Map of the
   * metadata. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public set metadata(value: ManifestAstValue.Map) {
    this._metadata = value;
  }

  /**
   * The access rules to use for the resource. The underlying type of this is a map which maps a
   * `ResourceMethodAuthKey` enum to a tuple of two `AccessRule`s denoting the current behavior and
   * the mutability. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public get accessRules() {
    return this._accessRules;
  }
  /**
   * The access rules to use for the resource. The underlying type of this is a map which maps a
   * `ResourceMethodAuthKey` enum to a tuple of two `AccessRule`s denoting the current behavior and
   * the mutability. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public set accessRules(value: ManifestAstValue.Map) {
    this._accessRules = value;
  }

  /**
   * A decimal value of the initial supply to mint during resource creation. If present, this is
   * serialized as a `Decimal` from the value model.
   */
  public get initialSupply() {
    return this._initialSupply;
  }
  /**
   * A decimal value of the initial supply to mint during resource creation. If present, this is
   * serialized as a `Decimal` from the value model.
   */
  public set initialSupply(value: ManifestAstValue.Decimal) {
    this._initialSupply = value;
  }

  constructor(
    divisibility: ManifestAstValue.U8,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map,
    initialSupply: ManifestAstValue.Decimal
  ) {
    this._divisibility = divisibility;
    this._metadata = metadata;
    this._accessRules = accessRules;
    this._initialSupply = initialSupply;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to create a new non-fungible resource.
 */
export class CreateNonFungibleResource {
  private _instruction: Kind = Kind.CreateNonFungibleResource;
  private _idType: ManifestAstValue.Enum;
  private _schema: ManifestAstValue.Blob;
  private _metadata: ManifestAstValue.Map;
  private _accessRules: ManifestAstValue.Map;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The type of the non-fungible id to use for this resource. This field is serialized as an `Enum`
   * from the ManifestAstValue model.
   */
  public get idType() {
    return this._idType;
  }
  /**
   * The type of the non-fungible id to use for this resource. This field is serialized as an `Enum`
   * from the ManifestAstValue model.
   */
  public set idType(value: ManifestAstValue.Enum) {
    this._idType = value;
  }

  /**
   * The schema that all non-fungibles of this resource must adhere to.
   */
  public get schema() {
    return this._schema;
  }
  /**
   * The schema that all non-fungibles of this resource must adhere to.
   */
  public set schema(value: ManifestAstValue.Blob) {
    this._schema = value;
  }

  /**
   * The metadata to set on the resource. The underlying type of this is a string-string Map of the
   * metadata. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public get metadata() {
    return this._metadata;
  }
  /**
   * The metadata to set on the resource. The underlying type of this is a string-string Map of the
   * metadata. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public set metadata(value: ManifestAstValue.Map) {
    this._metadata = value;
  }

  /**
   * The access rules to use for the resource. The underlying type of this is a map which maps a
   * `ResourceMethodAuthKey` enum to a tuple of two `AccessRule`s denoting the current behavior and
   * the mutability. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public get accessRules() {
    return this._accessRules;
  }
  /**
   * The access rules to use for the resource. The underlying type of this is a map which maps a
   * `ResourceMethodAuthKey` enum to a tuple of two `AccessRule`s denoting the current behavior and
   * the mutability. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public set accessRules(value: ManifestAstValue.Map) {
    this._accessRules = value;
  }

  constructor(
    idType: ManifestAstValue.Enum,
    schema: ManifestAstValue.Blob,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map
  ) {
    this._idType = idType;
    this._schema = schema;
    this._metadata = metadata;
    this._accessRules = accessRules;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * An instruction to create a non-fungible resource with an initial supply
 */
export class CreateNonFungibleResourceWithInitialSupply {
  private _instruction: Kind = Kind.CreateNonFungibleResourceWithInitialSupply;
  private _idType: ManifestAstValue.Enum;
  private _schema: ManifestAstValue.Blob;
  private _metadata: ManifestAstValue.Map;
  private _accessRules: ManifestAstValue.Map;
  private _initialSupply: ManifestAstValue.Any;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The type of the non-fungible id to use for this resource. This field is serialized as an `Enum`
   * from the ManifestAstValue model.
   */
  public get idType() {
    return this._idType;
  }
  /**
   * The type of the non-fungible id to use for this resource. This field is serialized as an `Enum`
   * from the ManifestAstValue model.
   */
  public set idType(value: ManifestAstValue.Enum) {
    this._idType = value;
  }

  /**
   * The schema that all non-fungibles of this resource must adhere to.
   */
  public get schema() {
    return this._schema;
  }
  /**
   * The schema that all non-fungibles of this resource must adhere to.
   */
  public set schema(value: ManifestAstValue.Blob) {
    this._schema = value;
  }

  /**
   * The metadata to set on the resource. The underlying type of this is a string-string Map of the
   * metadata. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public get metadata() {
    return this._metadata;
  }
  /**
   * The metadata to set on the resource. The underlying type of this is a string-string Map of the
   * metadata. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public set metadata(value: ManifestAstValue.Map) {
    this._metadata = value;
  }

  /**
   * The access rules to use for the resource. The underlying type of this is a map which maps a
   * `ResourceMethodAuthKey` enum to a tuple of two `AccessRule`s denoting the current behavior and
   * the mutability. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public get accessRules() {
    return this._accessRules;
  }
  /**
   * The access rules to use for the resource. The underlying type of this is a map which maps a
   * `ResourceMethodAuthKey` enum to a tuple of two `AccessRule`s denoting the current behavior and
   * the mutability. This is serialized as an `Map` from the ManifestAstValue model.
   */
  public set accessRules(value: ManifestAstValue.Map) {
    this._accessRules = value;
  }

  /**
   * An optional initial supply for the non-fungible resource being created. The underlying type of
   * this is a map which maps a `NonFungibleLocalId` to a tuple of two `ManifestAstValue` elements
   * where each element is a struct of the immutable and mutable parts of the non-fungible data.
   */
  public get initialSupply() {
    return this._initialSupply;
  }
  /**
   * An optional initial supply for the non-fungible resource being created. The underlying type of
   * this is a map which maps a `NonFungibleLocalId` to a tuple of two `ManifestAstValue` elements
   * where each element is a struct of the immutable and mutable parts of the non-fungible data.
   */
  public set initialSupply(value: ManifestAstValue.Any) {
    this._initialSupply = value;
  }

  constructor(
    idType: ManifestAstValue.Enum,
    schema: ManifestAstValue.Blob,
    metadata: ManifestAstValue.Map,
    accessRules: ManifestAstValue.Map,
    initialSupply: ManifestAstValue.Any
  ) {
    this._idType = idType;
    this._schema = schema;
    this._metadata = metadata;
    this._accessRules = accessRules;
    this._initialSupply = initialSupply;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * Creates a new access controller native component with the passed set of rules as the current
 * active rule set and the specified timed recovery delay in minutes.
 */
export class CreateAccessController {
  private _instruction: Kind = Kind.CreateAccessController;
  private _controlledAsset: ManifestAstValue.Bucket;
  private _ruleSet: ManifestAstValue.Tuple;
  private _timedRecoveryDelayInMinutes:
    | ManifestAstValue.Some
    | ManifestAstValue.None
    | ManifestAstValue.Enum;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * A bucket of the asset that will be controlled by the access controller. The underlying type of
   * this is a `Bucket` from the `ManifestAstValue` model.
   */
  public get controlledAsset() {
    return this._controlledAsset;
  }
  /**
   * A bucket of the asset that will be controlled by the access controller. The underlying type of
   * this is a `Bucket` from the `ManifestAstValue` model.
   */
  public set controlledAsset(value: ManifestAstValue.Bucket) {
    this._controlledAsset = value;
  }

  /**
   * The set of rules to use for the access controller's primary, confirmation, and recovery roles.
   */
  public get ruleSet() {
    return this._ruleSet;
  }
  /**
   * The set of rules to use for the access controller's primary, confirmation, and recovery roles.
   */
  public set ruleSet(value: ManifestAstValue.Tuple) {
    this._ruleSet = value;
  }

  /**
   * The recovery delay in minutes to use for the access controller. The underlying type of this is
   * an `Enum` or an `Option` from the `ManifestAstValue` model of an unsigned 32-bit integer of the
   * time in minutes.
   */
  public get timedRecoveryDelayInMinutes() {
    return this._timedRecoveryDelayInMinutes;
  }
  /**
   * The recovery delay in minutes to use for the access controller. The underlying type of this is
   * an `Enum` or an `Option` from the `ManifestAstValue` model of an unsigned 32-bit integer of the
   * time in minutes.
   */
  public set timedRecoveryDelayInMinutes(
    value: ManifestAstValue.Some | ManifestAstValue.None | ManifestAstValue.Enum
  ) {
    this._timedRecoveryDelayInMinutes = value;
  }

  constructor(
    controlledAsset: ManifestAstValue.Bucket,
    ruleSet: ManifestAstValue.Tuple,
    timedRecoveryDelayInMinutes:
      | ManifestAstValue.Some
      | ManifestAstValue.None
      | ManifestAstValue.Enum
  ) {
    this._controlledAsset = controlledAsset;
    this._ruleSet = ruleSet;
    this._timedRecoveryDelayInMinutes = timedRecoveryDelayInMinutes;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * Creates a new identity native component with the passed access rule.
 */
export class CreateIdentity {
  private _instruction: Kind = Kind.CreateIdentity;
  private _accessRule: ManifestAstValue.Enum;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The access rule to protect the identity with. The underlying type of this is an `Enum` from the
   * `ManifestAstValue` model.
   */
  public get accessRule() {
    return this._accessRule;
  }
  /**
   * The access rule to protect the identity with. The underlying type of this is an `Enum` from the
   * `ManifestAstValue` model.
   */
  public set accessRule(value: ManifestAstValue.Enum) {
    this._accessRule = value;
  }

  constructor(accessRule: ManifestAstValue.Enum) {
    this._accessRule = accessRule;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * Assert that the given access rule is currently fulfilled by the proofs in the Auth Zone of the
 * transaction
 */
export class AssertAccessRule {
  private _instruction: Kind = Kind.AssertAccessRule;
  private _accessRule: ManifestAstValue.Enum;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The access rule to assert. The underlying type of this is an `Enum` from the `ManifestAstValue`
   * model which represents the access rule to assert.
   */
  public get accessRule() {
    return this._accessRule;
  }
  /**
   * The access rule to assert. The underlying type of this is an `Enum` from the `ManifestAstValue`
   * model which represents the access rule to assert.
   */
  public set accessRule(value: ManifestAstValue.Enum) {
    this._accessRule = value;
  }

  constructor(accessRule: ManifestAstValue.Enum) {
    this._accessRule = accessRule;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * Creates a validator given the public key of the owner who controls it
 */
export class CreateValidator {
  private _instruction: Kind = Kind.CreateValidator;
  private _key: ManifestAstValue.String;
  private _ownerAccessRule: ManifestAstValue.Enum;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The ECDSA Secp256k1 public key of the owner of the validator. The underlying type of this is an
   * `EcdsaSecp256k1PublicKey` from the `ManifestAstValue` model.
   */
  public get key() {
    return this._key;
  }
  /**
   * The ECDSA Secp256k1 public key of the owner of the validator. The underlying type of this is an
   * `EcdsaSecp256k1PublicKey` from the `ManifestAstValue` model.
   */
  public set key(value: ManifestAstValue.String) {
    this._key = value;
  }

  /**
   * The access rule to protect the validator with. The underlying type of this is an `Enum` from
   * the `ManifestAstValue` model which represents the access rule to assert.
   */
  public get ownerAccessRule() {
    return this._ownerAccessRule;
  }
  /**
   * The access rule to protect the validator with. The underlying type of this is an `Enum` from
   * the `ManifestAstValue` model which represents the access rule to assert.
   */
  public set ownerAccessRule(value: ManifestAstValue.Enum) {
    this._ownerAccessRule = value;
  }

  constructor(
    key: ManifestAstValue.String,
    ownerAccessRule: ManifestAstValue.Enum
  ) {
    this._key = key;
    this._ownerAccessRule = ownerAccessRule;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * Creates a new global account component which has the withdraw rule seen in the rule.
 */
export class CreateAccount {
  private _instruction: Kind = Kind.CreateAccount;
  private _withdrawRule: ManifestAstValue.Enum;

  public get instruction(): Kind {
    return this._instruction;
  }
  /**
   * The withdraw rule to associate with the account.
   */
  public get withdrawRule() {
    return this._withdrawRule;
  }
  /**
   * The withdraw rule to associate with the account.
   */
  public set withdrawRule(value: ManifestAstValue.Enum) {
    this._withdrawRule = value;
  }

  constructor(withdrawRule: ManifestAstValue.Enum) {
    this._withdrawRule = withdrawRule;
  }

  toString(): string {
    return serialize(this);
  }
}
