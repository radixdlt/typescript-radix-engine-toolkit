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
import {
  Bytes,
  Convert,
  Expression,
  Instruction,
  ManifestAddress,
  TransactionManifest,
  Value,
  ValueKind,
  resolveBytes,
} from "..";

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

  popFromAuthZone(callback: (builder: this, proofId: number) => this): this {
    const instruction: Instruction = {
      kind: "PopFromAuthZone",
    };
    this.instructions.push(instruction);

    const proofId = this.idAllocator.proof();
    return callback(this, proofId);
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
    packageAddress: string | number,
    blueprintName: string,
    functionName: string,
    args: Value[]
  ): this {
    const instruction: Instruction = {
      kind: "CallFunction",
      packageAddress: resolveManifestAddress(packageAddress),
      blueprintName,
      functionName,
      args: { kind: ValueKind.Tuple, fields: args },
    };
    this.instructions.push(instruction);
    return this;
  }

  callMethod(
    address: string | number,
    methodName: string,
    args: Value[]
  ): this {
    const instruction: Instruction = {
      kind: "CallMethod",
      address: resolveManifestAddress(address),
      methodName,
      args: { kind: ValueKind.Tuple, fields: args },
    };
    this.instructions.push(instruction);
    return this;
  }

  callRoyaltyMethod(
    address: string | number,
    methodName: string,
    args: Value[]
  ): this {
    const instruction: Instruction = {
      kind: "CallRoyaltyMethod",
      address: resolveManifestAddress(address),
      methodName,
      args: { kind: ValueKind.Tuple, fields: args },
    };
    this.instructions.push(instruction);
    return this;
  }

  callMetadataMethod(
    address: string | number,
    methodName: string,
    args: Value[]
  ): this {
    const instruction: Instruction = {
      kind: "CallMetadataMethod",
      address: resolveManifestAddress(address),
      methodName,
      args: { kind: ValueKind.Tuple, fields: args },
    };
    this.instructions.push(instruction);
    return this;
  }

  callRoleAssignmentMethod(
    address: string | number,
    methodName: string,
    args: Value[]
  ): this {
    const instruction: Instruction = {
      kind: "CallRoleAssignmentMethod",
      address: resolveManifestAddress(address),
      methodName,
      args: { kind: ValueKind.Tuple, fields: args },
    };
    this.instructions.push(instruction);
    return this;
  }

  callDirectVaultMethod(
    address: string,
    methodName: string,
    args: Value[]
  ): this {
    const instruction: Instruction = {
      kind: "CallDirectVaultMethod",
      address,
      methodName,
      args: { kind: ValueKind.Tuple, fields: args },
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

declare type BoolValue = Extract<Value, { kind: ValueKind.Bool }>;
declare type I8Value = Extract<Value, { kind: ValueKind.I8 }>;
declare type I16Value = Extract<Value, { kind: ValueKind.I16 }>;
declare type I32Value = Extract<Value, { kind: ValueKind.I32 }>;
declare type I64Value = Extract<Value, { kind: ValueKind.I64 }>;
declare type I128Value = Extract<Value, { kind: ValueKind.I128 }>;
declare type U8Value = Extract<Value, { kind: ValueKind.U8 }>;
declare type U16Value = Extract<Value, { kind: ValueKind.U16 }>;
declare type U32Value = Extract<Value, { kind: ValueKind.U32 }>;
declare type U64Value = Extract<Value, { kind: ValueKind.U64 }>;
declare type U128Value = Extract<Value, { kind: ValueKind.U128 }>;
declare type StringValue = Extract<Value, { kind: ValueKind.String }>;
declare type EnumValue = Extract<Value, { kind: ValueKind.Enum }>;
declare type ArrayValue = Extract<Value, { kind: ValueKind.Array }>;
declare type TupleValue = Extract<Value, { kind: ValueKind.Tuple }>;
declare type MapValue = Extract<Value, { kind: ValueKind.Map }>;
declare type AddressValue = Extract<Value, { kind: ValueKind.Address }>;
declare type BucketValue = Extract<Value, { kind: ValueKind.Bucket }>;
declare type ProofValue = Extract<Value, { kind: ValueKind.Proof }>;
declare type ExpressionValue = Extract<Value, { kind: ValueKind.Expression }>;
declare type BlobValue = Extract<Value, { kind: ValueKind.Blob }>;
declare type DecimalValue = Extract<Value, { kind: ValueKind.Decimal }>;
declare type PreciseDecimalValue = Extract<
  Value,
  { kind: ValueKind.PreciseDecimal }
>;
declare type NonFungibleLocalIdValue = Extract<
  Value,
  { kind: ValueKind.NonFungibleLocalId }
>;
declare type AddressReservationValue = Extract<
  Value,
  { kind: ValueKind.AddressReservation }
>;

export const bool = (value: boolean): BoolValue => {
  return {
    kind: ValueKind.Bool,
    value,
  };
};

export const i8 = (value: number | string): I8Value => {
  return {
    kind: ValueKind.I8,
    value: resolveNumber(value),
  };
};

export const i16 = (value: number | string): I16Value => {
  return {
    kind: ValueKind.I16,
    value: resolveNumber(value),
  };
};

export const i32 = (value: number | string): I32Value => {
  return {
    kind: ValueKind.I32,
    value: resolveNumber(value),
  };
};

export const i64 = (value: number | bigint | string): I64Value => {
  return {
    kind: ValueKind.I64,
    value: resolveBigInt(value),
  };
};

export const i128 = (value: number | bigint | string): I128Value => {
  return {
    kind: ValueKind.I128,
    value: resolveBigInt(value),
  };
};

export const u8 = (value: number | string): U8Value => {
  return {
    kind: ValueKind.U8,
    value: resolveNumber(value),
  };
};

export const u16 = (value: number | string): U16Value => {
  return {
    kind: ValueKind.U16,
    value: resolveNumber(value),
  };
};

export const u32 = (value: number | string): U32Value => {
  return {
    kind: ValueKind.U32,
    value: resolveNumber(value),
  };
};

export const u64 = (value: number | bigint | string): U64Value => {
  return {
    kind: ValueKind.U64,
    value: resolveBigInt(value),
  };
};

export const u128 = (value: number | bigint | string): U128Value => {
  return {
    kind: ValueKind.U128,
    value: resolveBigInt(value),
  };
};

export const str = (value: string): StringValue => {
  return {
    kind: ValueKind.String,
    value,
  };
};

export const enumeration = (
  discriminator: number,
  ...fields: Value[]
): EnumValue => {
  return {
    kind: ValueKind.Enum,
    discriminator,
    fields,
  };
};

export const array = (
  elementKind: ValueKind,
  ...elements: Value[]
): ArrayValue => {
  return {
    kind: ValueKind.Array,
    elementValueKind: elementKind,
    elements,
  };
};

export const tuple = (...fields: Value[]): TupleValue => {
  return {
    kind: ValueKind.Tuple,
    fields,
  };
};

export const map = (
  keyKind: ValueKind,
  valueKind: ValueKind,
  ...entries: [Value, Value][]
): MapValue => {
  return {
    kind: ValueKind.Map,
    keyValueKind: keyKind,
    valueValueKind: valueKind,
    entries: entries.map(([key, value]) => {
      return { key, value };
    }),
  };
};

export const address = (value: string | number): AddressValue => {
  switch (typeof value) {
    case "string":
      return {
        kind: ValueKind.Address,
        value: {
          kind: "Static",
          value: value as string,
        },
      };
    case "number":
      return {
        kind: ValueKind.Address,
        value: {
          kind: "Named",
          value: value as number,
        },
      };
    default:
      throw new Error();
  }
};

export const bucket = (value: number): BucketValue => {
  return {
    kind: ValueKind.Bucket,
    value,
  };
};

export const proof = (value: number): ProofValue => {
  return {
    kind: ValueKind.Proof,
    value,
  };
};

export const expression = (
  value: "EntireWorktop" | "EntireAuthZone"
): ExpressionValue => {
  return {
    kind: ValueKind.Expression,
    value: Expression[value],
  };
};

export const decimal = (
  value: number | bigint | string | Decimal
): DecimalValue => {
  return {
    kind: ValueKind.Decimal,
    value: resolveDecimal(value),
  };
};

export const preciseDecimal = (
  value: number | bigint | string | Decimal
): PreciseDecimalValue => {
  return {
    kind: ValueKind.PreciseDecimal,
    value: resolveDecimal(value),
  };
};

export const blob = (value: Bytes): BlobValue => {
  return {
    kind: ValueKind.Blob,
    value: resolveBytes(value),
  };
};

export const nonFungibleLocalId = (value: string): NonFungibleLocalIdValue => {
  return {
    kind: ValueKind.NonFungibleLocalId,
    value,
  };
};

export const addressReservation = (value: number): AddressReservationValue => {
  return {
    kind: ValueKind.AddressReservation,
    value,
  };
};

const resolveBigInt = (value: number | bigint | string): bigint => {
  switch (typeof value) {
    case "string":
      return BigInt(value as string);
    case "number":
      return BigInt(value as number);
    case "bigint":
      return value as bigint;
    default:
      throw new Error();
  }
};

const resolveDecimal = (value: number | bigint | string | Decimal): Decimal => {
  switch (typeof value) {
    case "string":
      return new Decimal(value as string);
    case "number":
      return new Decimal(value as number);
    case "bigint":
      return new Decimal(Convert.BigInt.toString(value as bigint));
    case "object":
      return value as Decimal;
    default:
      throw new Error();
  }
};

const resolveNumber = (value: number | string): number => {
  switch (typeof value) {
    case "string":
      return Number(value as string);
    case "number":
      return value as number;
    default:
      throw new Error();
  }
};

const resolveManifestAddress = (value: string | number): ManifestAddress => {
  switch (typeof value) {
    case "string":
      return {
        kind: "Static",
        value: value as string,
      };
    case "number":
      return {
        kind: "Named",
        value: value as number,
      };
    default:
      throw new Error();
  }
};
