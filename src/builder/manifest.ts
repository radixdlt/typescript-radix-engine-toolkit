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
import { Instruction, ManifestAddress, TransactionManifest, Value } from "..";

export class ManifestBuilder {
  private instructions: Instruction[] = [];
  private blobs: Uint8Array[] = [];
  private idAllocator: IdAllocator = new IdAllocator();

  takeAllFromWorktop(
    resourceAddress: string,
    callback: (builder: this, bucketId: number) => this
  ): this {
    const instruction: Instruction = {
      kind: "TakeAllFromWorktop",
      resourceAddress,
    };
    this.instructions.push(instruction);

    const builderId = this.idAllocator.bucket();
    return callback(this, builderId);
  }

  takeFromWorktop(
    resourceAddress: string,
    amount: Decimal,
    callback: (builder: this, bucketId: number) => this
  ): this {
    const instruction: Instruction = {
      kind: "TakeFromWorktop",
      resourceAddress,
      amount,
    };
    this.instructions.push(instruction);

    const builderId = this.idAllocator.bucket();
    return callback(this, builderId);
  }

  takeNonFungiblesFromWorktop(
    resourceAddress: string,
    ids: string[],
    callback: (builder: this, bucketId: number) => this
  ): this {
    const instruction: Instruction = {
      kind: "TakeNonFungiblesFromWorktop",
      resourceAddress,
      ids,
    };
    this.instructions.push(instruction);

    const builderId = this.idAllocator.bucket();
    return callback(this, builderId);
  }

  returnToWorktop(bucketId: number): this {
    const instruction: Instruction = {
      kind: "ReturnToWorktop",
      bucketId,
    };
    this.instructions.push(instruction);
    return this;
  }

  assertWorktopContainsAny(resourceAddress: string): this {
    const instruction: Instruction = {
      kind: "AssertWorktopContainsAny",
      resourceAddress,
    };
    this.instructions.push(instruction);
    return this;
  }

  assertWorktopContains(resourceAddress: string, amount: Decimal): this {
    const instruction: Instruction = {
      kind: "AssertWorktopContains",
      resourceAddress,
      amount,
    };
    this.instructions.push(instruction);
    return this;
  }

  assertWorktopContainsNonFungibles(
    resourceAddress: string,
    ids: string[]
  ): this {
    const instruction: Instruction = {
      kind: "AssertWorktopContainsNonFungibles",
      resourceAddress,
      ids,
    };
    this.instructions.push(instruction);
    return this;
  }

  popFromAuthZone(): this {
    const instruction: Instruction = {
      kind: "PopFromAuthZone",
    };
    this.instructions.push(instruction);
    return this;
  }

  pushToAuthZone(proofId: number): this {
    const instruction: Instruction = {
      kind: "PushToAuthZone",
      proofId,
    };
    this.instructions.push(instruction);
    return this;
  }

  dropAuthZoneProofs(): this {
    const instruction: Instruction = {
      kind: "DropAuthZoneProofs",
    };
    this.instructions.push(instruction);
    return this;
  }

  createProofFromAuthZoneOfAmount(
    resourceAddress: string,
    amount: Decimal,
    callback: (builder: this, proofId: number) => this
  ): this {
    const instruction: Instruction = {
      kind: "CreateProofFromAuthZoneOfAmount",
      resourceAddress,
      amount,
    };
    this.instructions.push(instruction);

    const proofId = this.idAllocator.proof();
    return callback(this, proofId);
  }

  createProofFromAuthZoneOfNonFungibles(
    resourceAddress: string,
    ids: string[],
    callback: (builder: this, proofId: number) => this
  ): this {
    const instruction: Instruction = {
      kind: "CreateProofFromAuthZoneOfNonFungibles",
      resourceAddress,
      ids,
    };
    this.instructions.push(instruction);

    const proofId = this.idAllocator.proof();
    return callback(this, proofId);
  }

  createProofFromAuthZoneOfAll(
    resourceAddress: string,
    callback: (builder: this, proofId: number) => this
  ): this {
    const instruction: Instruction = {
      kind: "CreateProofFromAuthZoneOfAll",
      resourceAddress,
    };
    this.instructions.push(instruction);

    const proofId = this.idAllocator.proof();
    return callback(this, proofId);
  }

  dropAuthZoneSignatureProofs(): this {
    const instruction: Instruction = {
      kind: "DropAuthZoneSignatureProofs",
    };
    this.instructions.push(instruction);
    return this;
  }

  createProofFromBucketOfAmount(
    bucketId: number,
    amount: Decimal,
    callback: (builder: this, proofId: number) => this
  ): this {
    const instruction: Instruction = {
      kind: "CreateProofFromBucketOfAmount",
      bucketId,
      amount,
    };
    this.instructions.push(instruction);

    const proofId = this.idAllocator.proof();
    return callback(this, proofId);
  }

  createProofFromBucketOfNonFungibles(
    bucketId: number,
    ids: string[],
    callback: (builder: this, proofId: number) => this
  ): this {
    const instruction: Instruction = {
      kind: "CreateProofFromBucketOfNonFungibles",
      bucketId,
      ids,
    };
    this.instructions.push(instruction);

    const proofId = this.idAllocator.proof();
    return callback(this, proofId);
  }

  createProofFromBucketOfAll(
    bucketId: number,
    callback: (builder: this, proofId: number) => this
  ): this {
    const instruction: Instruction = {
      kind: "CreateProofFromBucketOfAll",
      bucketId,
    };
    this.instructions.push(instruction);

    const proofId = this.idAllocator.proof();
    return callback(this, proofId);
  }

  burnResource(bucketId: number): this {
    const instruction: Instruction = {
      kind: "BurnResource",
      bucketId,
    };
    this.instructions.push(instruction);
    return this;
  }

  cloneProof(
    proofId: number,
    callback: (builder: this, proofId: number) => this
  ): this {
    const instruction: Instruction = {
      kind: "CloneProof",
      proofId,
    };
    this.instructions.push(instruction);

    const newProofId = this.idAllocator.proof();
    return callback(this, newProofId);
  }

  dropProof(proofId: number): this {
    const instruction: Instruction = {
      kind: "DropProof",
      proofId,
    };
    this.instructions.push(instruction);
    return this;
  }

  callFunction(
    packageAddress: ManifestAddress,
    blueprintName: string,
    functionName: string,
    args: Value
  ): this {
    const instruction: Instruction = {
      kind: "CallFunction",
      packageAddress,
      blueprintName,
      functionName,
      args,
    };
    this.instructions.push(instruction);
    return this;
  }

  callMethod(address: ManifestAddress, methodName: string, args: Value): this {
    const instruction: Instruction = {
      kind: "CallMethod",
      address,
      methodName,
      args,
    };
    this.instructions.push(instruction);
    return this;
  }

  callRoyaltyMethod(
    address: ManifestAddress,
    methodName: string,
    args: Value
  ): this {
    const instruction: Instruction = {
      kind: "CallRoyaltyMethod",
      address,
      methodName,
      args,
    };
    this.instructions.push(instruction);
    return this;
  }

  callMetadataMethod(
    address: ManifestAddress,
    methodName: string,
    args: Value
  ): this {
    const instruction: Instruction = {
      kind: "CallMetadataMethod",
      address,
      methodName,
      args,
    };
    this.instructions.push(instruction);
    return this;
  }

  callRoleAssignmentMethod(
    address: ManifestAddress,
    methodName: string,
    args: Value
  ): this {
    const instruction: Instruction = {
      kind: "CallRoleAssignmentMethod",
      address,
      methodName,
      args,
    };
    this.instructions.push(instruction);
    return this;
  }

  callDirectVaultMethod(
    address: string,
    methodName: string,
    args: Value
  ): this {
    const instruction: Instruction = {
      kind: "CallDirectVaultMethod",
      address,
      methodName,
      args,
    };
    this.instructions.push(instruction);
    return this;
  }

  dropAllProofs(): this {
    const instruction: Instruction = {
      kind: "DropAllProofs",
    };
    this.instructions.push(instruction);
    return this;
  }

  allocateGlobalAddress(packageAddress: string, blueprintName: string): this {
    const instruction: Instruction = {
      kind: "AllocateGlobalAddress",
      packageAddress,
      blueprintName,
    };
    this.instructions.push(instruction);
    return this;
  }

  build(): TransactionManifest {
    return {
      instructions: {
        kind: "Parsed",
        value: this.instructions,
      },
      blobs: this.blobs,
    };
  }
}

class IdAllocator {
  private nextBucketId: number = 0;
  private nextProofId: number = 0;
  private nextAddressReservation: number = 0;
  private nextNamedAddress: number = 0;

  bucket(): number {
    return this.nextBucketId++;
  }

  proof(): number {
    return this.nextProofId++;
  }

  addressReservation(): number {
    return this.nextAddressReservation++;
  }

  namedAddress(): number {
    return this.nextNamedAddress++;
  }
}
