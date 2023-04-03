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

// TODO: Add getters and setters to all of the models in here
// TODO: Add to string methods
// TODO: Convert U64 and I64 to use BigInt

import {
  bigIntToString,
  numberToString,
  stringToBigInt,
  stringToNumber,
  stringToUint8Array,
  uint8ArrayToString,
} from "../../utils";

export type Value =
  | Bool
  | U8
  | U16
  | U32
  | U64
  | U128
  | I8
  | I16
  | I32
  | I64
  | I128
  | String
  | Enum
  | Some
  | None
  | Ok
  | Err
  | Array
  | Map
  | Tuple
  | Decimal
  | PreciseDecimal
  | Address
  | Bucket
  | Proof
  | NonFungibleLocalId
  | NonFungibleGlobalId
  | Expression
  | Blob
  | Bytes;

export enum Kind {
  Bool = "Bool",
  U8 = "U8",
  U16 = "U16",
  U32 = "U32",
  U64 = "U64",
  U128 = "U128",
  I8 = "I8",
  I16 = "I16",
  I32 = "I32",
  I64 = "I64",
  I128 = "I128",
  String = "String",
  Enum = "Enum",
  Some = "Some",
  None = "None",
  Ok = "Ok",
  Err = "Err",
  Array = "Array",
  Map = "Map",
  Tuple = "Tuple",
  Decimal = "Decimal",
  PreciseDecimal = "PreciseDecimal",
  Address = "Address",
  Bucket = "Bucket",
  Proof = "Proof",
  NonFungibleLocalId = "NonFungibleLocalId",
  NonFungibleGlobalId = "NonFungibleGlobalId",
  Expression = "Expression",
  Blob = "Blob",
  Bytes = "Bytes",
}

export class Bool {
  type: Kind = Kind.Bool;
  value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }
}

export class U8 {
  type: Kind = Kind.U8;
  value: string;

  get val(): number {
    return stringToNumber(this.value);
  }

  set val(value: number) {
    this.value = numberToString(value);
  }

  constructor(value: number) {
    this.value = numberToString(value);
  }
}

export class U16 {
  type: Kind = Kind.U16;
  value: string;

  get val(): number {
    return stringToNumber(this.value);
  }

  set val(value: number) {
    this.value = numberToString(value);
  }

  constructor(value: number) {
    this.value = numberToString(value);
  }
}

export class U32 {
  type: Kind = Kind.U32;
  value: string;

  get val(): number {
    return stringToNumber(this.value);
  }

  set val(value: number) {
    this.value = numberToString(value);
  }

  constructor(value: number) {
    this.value = numberToString(value);
  }
}

export class U64 {
  type: Kind = Kind.U64;
  value: string;

  get val(): number {
    return stringToNumber(this.value);
  }

  set val(value: number) {
    this.value = numberToString(value);
  }

  constructor(value: number) {
    this.value = numberToString(value);
  }
}

export class U128 {
  type: Kind = Kind.U128;
  value: string;

  get val(): BigInt {
    return stringToBigInt(this.value);
  }

  set val(value: BigInt) {
    this.value = bigIntToString(value);
  }

  constructor(value: BigInt) {
    this.value = bigIntToString(value);
  }
}

export class I8 {
  type: Kind = Kind.I8;
  value: string;

  get val(): number {
    return stringToNumber(this.value);
  }

  set val(value: number) {
    this.value = numberToString(value);
  }

  constructor(value: number) {
    this.value = numberToString(value);
  }
}

export class I16 {
  type: Kind = Kind.I16;
  value: string;

  get val(): number {
    return stringToNumber(this.value);
  }

  set val(value: number) {
    this.value = numberToString(value);
  }

  constructor(value: number) {
    this.value = numberToString(value);
  }
}

export class I32 {
  type: Kind = Kind.I32;
  value: string;

  get val(): number {
    return stringToNumber(this.value);
  }

  set val(value: number) {
    this.value = numberToString(value);
  }

  constructor(value: number) {
    this.value = numberToString(value);
  }
}

export class I64 {
  type: Kind = Kind.I64;
  value: string;

  get val(): number {
    return stringToNumber(this.value);
  }

  set val(value: number) {
    this.value = numberToString(value);
  }

  constructor(value: number) {
    this.value = numberToString(value);
  }
}

export class I128 {
  type: Kind = Kind.I128;
  value: string;

  get val(): BigInt {
    return stringToBigInt(this.value);
  }

  set val(value: BigInt) {
    this.value = bigIntToString(value);
  }

  constructor(value: BigInt) {
    this.value = bigIntToString(value);
  }
}

export class String {
  type: Kind = Kind.String;
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}

export class Enum {
  type: Kind = Kind.Enum;
  variant: EnumDiscriminator;
  fields: globalThis.Array<Value> = [];

  constructor(
    variant: EnumDiscriminator,
    fields: globalThis.Array<Value> = []
  ) {
    this.variant = variant;
    this.fields = fields;
  }
}

// TODO: Remove once toolkit uses regular U8 and String for the discriminator
export type EnumDiscriminator = EnumStringDiscriminator | EnumU8Discriminator;

export class EnumStringDiscriminator {
  type: Kind = Kind.String;
  discriminator: string;

  constructor(discriminator: string) {
    this.discriminator = discriminator;
  }
}

export class EnumU8Discriminator {
  type: Kind = Kind.U8;
  discriminator: string;

  get val(): number {
    return stringToNumber(this.discriminator);
  }

  set val(value: number) {
    this.discriminator = numberToString(value);
  }

  constructor(value: number) {
    this.discriminator = numberToString(value);
  }
}

export class Some {
  type: Kind = Kind.Some;
  value: Value;

  constructor(value: Value) {
    this.value = value;
  }
}

export class None {
  type: Kind = Kind.None;

  constructor() {}
}

export class Ok {
  type: Kind = Kind.Ok;
  value: Value;

  constructor(value: Value) {
    this.value = value;
  }
}

export class Err {
  type: Kind = Kind.Err;
  value: Value;

  constructor(value: Value) {
    this.value = value;
  }
}

export class Array {
  type: Kind = Kind.Array;
  element_kind: Kind;
  elements: globalThis.Array<Value>;

  constructor(element_kind: Kind, elements: globalThis.Array<Value>) {
    this.element_kind = element_kind;
    this.elements = elements;
  }
}

export class Map {
  type: Kind = Kind.Map;
  key_value_kind: Kind;
  value_value_kind: Kind;
  entries: globalThis.Array<[Value, Value]> = [];

  get keyValueKind(): Kind {
    return this.key_value_kind;
  }

  set keyValueKind(keyValueKind: Kind) {
    this.key_value_kind = keyValueKind;
  }

  get valueValueKind(): Kind {
    return this.value_value_kind;
  }

  set valueValueKind(valueValueKind: Kind) {
    this.value_value_kind = valueValueKind;
  }

  get items(): globalThis.Array<[Value, Value]> {
    return this.entries;
  }

  set items(elements: globalThis.Array<[Value, Value]>) {
    this.entries = elements;
  }

  constructor(
    key_value_kind: Kind,
    value_value_kind: Kind,
    elements: globalThis.Array<[Value, Value]> = []
  ) {
    this.key_value_kind = key_value_kind;
    this.value_value_kind = value_value_kind;
    this.entries = elements;
  }
}

export class Tuple {
  type: Kind = Kind.Tuple;
  elements: globalThis.Array<Value> = [];

  constructor(elements: globalThis.Array<Value> = []) {
    this.elements = elements;
  }
}

export class Decimal {
  type: Kind = Kind.Decimal;
  value: BigInt;

  constructor(value: BigInt) {
    this.value = value;
  }
}

export class PreciseDecimal {
  type: Kind = Kind.PreciseDecimal;
  value: BigInt;

  constructor(value: BigInt) {
    this.value = value;
  }
}

export class Address {
  type: Kind = Kind.Address;
  address: string;

  constructor(address: string) {
    this.address = address;
  }
}

export class Bucket {
  type: Kind = Kind.Bucket;
  identifier: String | U32;

  constructor(identifier: String | U32) {
    this.identifier = identifier;
  }
}

export class Proof {
  type: Kind = Kind.Proof;
  identifier: String | U32;

  constructor(identifier: String | U32) {
    this.identifier = identifier;
  }
}

export class Expression {
  type: Kind = Kind.Expression;
  value: string;

  constructor(expression: string) {
    this.value = expression;
  }

  static entireWorktop(): Expression {
    return new Expression("ENTIRE_WORKTOP");
  }

  static entireAuthZone(): Expression {
    return new Expression("ENTIRE_AUTH_ZONE");
  }
}

export class NonFungibleLocalId {
  type: Kind = Kind.NonFungibleLocalId;
  value: UUID | Integer | String | Bytes;

  constructor(value: UUID | Integer | String | Bytes) {
    this.value = value;
  }
}

export class NonFungibleGlobalId {
  type: Kind = Kind.NonFungibleGlobalId;
  resource_address: Address;
  non_fungible_local_id: NonFungibleLocalId;

  get resourceAddress(): Address {
    return this.resource_address;
  }

  set resourceAddress(address: Address) {
    this.resource_address = address;
  }

  get nonFungibleLocalId(): NonFungibleLocalId {
    return this.nonFungibleLocalId;
  }

  set nonFungibleLocalId(nonFungibleLocalId: NonFungibleLocalId) {
    this.non_fungible_local_id = nonFungibleLocalId;
  }

  constructor(
    resourceAddress: Address,
    nonFungibleLocalId: NonFungibleLocalId
  ) {
    this.resource_address = resourceAddress;
    this.non_fungible_local_id = nonFungibleLocalId;
  }
}

export class Integer {
  type: string = "Integer";
  value: string;

  get val(): number {
    return stringToNumber(this.value);
  }

  set val(value: number) {
    this.value = numberToString(value);
  }

  constructor(value: number) {
    this.value = numberToString(value);
  }
}

export class UUID {
  type: string = "UUID";
  value: BigInt;

  constructor(value: BigInt) {
    this.value = value;
  }
}

export class Blob {
  type: Kind = Kind.Blob;
  hash: string;

  get val(): Uint8Array {
    return stringToUint8Array(this.hash);
  }

  set val(hash: Uint8Array) {
    this.hash = uint8ArrayToString(hash);
  }

  constructor(hash: Uint8Array) {
    this.hash = uint8ArrayToString(hash);
  }
}

export class Bytes {
  type: Kind = Kind.Bytes;
  value: string;

  get val(): Uint8Array {
    return stringToUint8Array(this.value);
  }

  set val(value: Uint8Array) {
    this.value = uint8ArrayToString(value);
  }

  constructor(value: Uint8Array) {
    this.value = uint8ArrayToString(value);
  }
}
