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
import { Instruction } from ".";

const instructionTypeOptions: TypeOptions = {
  discriminator: {
    property: "instruction",
    subTypes: [
      { name: "CALL_FUNCTION", value: Instruction.CallFunction },
      { name: "CALL_METHOD", value: Instruction.CallMethod },
      { name: "TAKE_FROM_WORKTOP", value: Instruction.TakeFromWorktop },
      {
        name: "TAKE_FROM_WORKTOP_BY_AMOUNT",
        value: Instruction.TakeFromWorktopByAmount,
      },
      {
        name: "TAKE_FROM_WORKTOP_BY_IDS",
        value: Instruction.TakeFromWorktopByIds,
      },
      { name: "RETURN_TO_WORKTOP", value: Instruction.ReturnToWorktop },
      {
        name: "ASSERT_WORKTOP_CONTAINS",
        value: Instruction.AssertWorktopContains,
      },
      {
        name: "ASSERT_WORKTOP_CONTAINS_BY_AMOUNT",
        value: Instruction.AssertWorktopContainsByAmount,
      },
      {
        name: "ASSERT_WORKTOP_CONTAINS_BY_IDS",
        value: Instruction.AssertWorktopContainsByIds,
      },
      { name: "POP_FROM_AUTH_ZONE", value: Instruction.PopFromAuthZone },
      { name: "PUSH_TO_AUTH_ZONE", value: Instruction.PushToAuthZone },
      { name: "CLEAR_AUTH_ZONE", value: Instruction.ClearAuthZone },
      {
        name: "CLEAR_SIGNATURE_PROOFS",
        value: Instruction.ClearSignatureProofs,
      },
      {
        name: "CREATE_PROOF_FROM_AUTH_ZONE",
        value: Instruction.CreateProofFromAuthZone,
      },
      {
        name: "CREATE_PROOF_FROM_AUTH_ZONE_BY_AMOUNT",
        value: Instruction.CreateProofFromAuthZoneByAmount,
      },
      {
        name: "CREATE_PROOF_FROM_AUTH_ZONE_BY_IDS",
        value: Instruction.CreateProofFromAuthZoneByIds,
      },
      {
        name: "CREATE_PROOF_FROM_BUCKET",
        value: Instruction.CreateProofFromBucket,
      },
      { name: "CLONE_PROOF", value: Instruction.CloneProof },
      { name: "DROP_PROOF", value: Instruction.DropProof },
      { name: "DROP_ALL_PROOFS", value: Instruction.DropAllProofs },
      { name: "PUBLISH_PACKAGE", value: Instruction.PublishPackage },
      {
        name: "PUBLISH_PACKAGE_ADVANCED",
        value: Instruction.PublishPackageAdvanced,
      },
      { name: "BURN_RESOURCE", value: Instruction.BurnResource },
      { name: "RECALL_RESOURCE", value: Instruction.RecallResource },
      { name: "SET_METADATA", value: Instruction.SetMetadata },
      { name: "REMOVE_METADATA", value: Instruction.RemoveMetadata },
      {
        name: "SET_PACKAGE_ROYALTY_CONFIG",
        value: Instruction.SetPackageRoyaltyConfig,
      },
      {
        name: "SET_COMPONENT_ROYALTY_CONFIG",
        value: Instruction.SetComponentRoyaltyConfig,
      },
      { name: "CLAIM_PACKAGE_ROYALTY", value: Instruction.ClaimPackageRoyalty },
      {
        name: "CLAIM_COMPONENT_ROYALTY",
        value: Instruction.ClaimComponentRoyalty,
      },
      {
        name: "SET_METHOD_ACCESS_RULE",
        value: Instruction.SetMethodAccessRule,
      },
      { name: "MINT_FUNGIBLE", value: Instruction.MintFungible },
      { name: "MINT_NON_FUNGIBLE", value: Instruction.MintNonFungible },
      {
        name: "MINT_UUID_NON_FUNGIBLE",
        value: Instruction.MintUuidNonFungible,
      },
      {
        name: "CREATE_FUNGIBLE_RESOURCE",
        value: Instruction.CreateFungibleResource,
      },
      {
        name: "CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY",
        value: Instruction.CreateFungibleResourceWithInitialSupply,
      },
      {
        name: "CREATE_NON_FUNGIBLE_RESOURCE",
        value: Instruction.CreateNonFungibleResource,
      },
      {
        name: "CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY",
        value: Instruction.CreateNonFungibleResourceWithInitialSupply,
      },
      {
        name: "CREATE_ACCESS_CONTROLLER",
        value: Instruction.CreateAccessController,
      },
      { name: "CREATE_VALIDATOR", value: Instruction.CreateValidator },
      { name: "CREATE_IDENTITY", value: Instruction.CreateIdentity },
      { name: "CREATE_ACCOUNT", value: Instruction.CreateAccount },
      {
        name: "CREATE_IDENTITY_ADVANCED",
        value: Instruction.CreateIdentityAdvanced,
      },
      {
        name: "CREATE_ACCOUNT_ADVANCED",
        value: Instruction.CreateAccountAdvanced,
      },
    ],
  },
};

export class InstructionList {
  readonly type: Kind;

  constructor(type: Kind) {
    this.type = type;
  }
}

export enum Kind {
  String = "String",
  Parsed = "Parsed",
}

export class StringInstructions extends InstructionList {
  @Expose()
  value: string;

  constructor(instructions: string) {
    super(Kind.String);
    this.value = instructions;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class ParsedInstructions extends InstructionList {
  @Expose()
  @Type(() => Instruction.Instruction, instructionTypeOptions)
  value: Array<Instruction.Instruction>;

  constructor(instructions: Array<Instruction.Instruction>) {
    super(Kind.Parsed);
    this.value = instructions;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
