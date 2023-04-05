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

export type Any =
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
  | Array
  | Map
  | Tuple
  | Address
  | Bucket
  | Proof
  | Decimal
  | PreciseDecimal
  | NonFungibleLocalId
  | Expression
  | Blob;

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
  Array = "Array",
  Map = "Map",
  Tuple = "Tuple",
  Address = "Address",
  Bucket = "Bucket",
  Proof = "Proof",
  Decimal = "Decimal",
  PreciseDecimal = "PreciseDecimal",
  NonFungibleLocalId = "NonFungibleLocalId",
  Expression = "Expression",
  Blob = "Blob",
}

export class Bool {
  private _type: Kind = Kind.Bool;
  private _value: boolean;

  public get value(): boolean {
    return this._value;
  }
  public set value(value: boolean) {
    this._value = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: boolean) {
    this._value = value;
  }
}

export class U8 {
  private _type: Kind = Kind.U8;
  private _value: string;

  get value(): number {
    return stringToNumber(this._value);
  }

  set value(value: number) {
    this._value = numberToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: number) {
    this._value = numberToString(value);
  }
}

export class U16 {
  private _type: Kind = Kind.U16;
  private _value: string;

  get value(): number {
    return stringToNumber(this._value);
  }

  set value(value: number) {
    this._value = numberToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: number) {
    this._value = numberToString(value);
  }
}

export class U32 {
  private _type: Kind = Kind.U32;
  private _value: string;

  get value(): number {
    return stringToNumber(this._value);
  }

  set value(value: number) {
    this._value = numberToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: number) {
    this._value = numberToString(value);
  }
}

export class U64 {
  private _type: Kind = Kind.U64;
  private _value: string;

  get value(): number {
    return stringToNumber(this._value);
  }

  set value(value: number) {
    this._value = numberToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: number) {
    this._value = numberToString(value);
  }
}

export class U128 {
  private _type: Kind = Kind.U128;
  private _value: string;

  get value(): BigInt {
    return stringToBigInt(this._value);
  }

  set value(value: BigInt) {
    this._value = bigIntToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: BigInt) {
    this._value = bigIntToString(value);
  }
}

export class I8 {
  private _type: Kind = Kind.I8;
  private _value: string;

  get value(): number {
    return stringToNumber(this._value);
  }

  set value(value: number) {
    this._value = numberToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: number) {
    this._value = numberToString(value);
  }
}

export class I16 {
  private _type: Kind = Kind.I16;
  private _value: string;

  get value(): number {
    return stringToNumber(this._value);
  }

  set value(value: number) {
    this._value = numberToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: number) {
    this._value = numberToString(value);
  }
}

export class I32 {
  private _type: Kind = Kind.I32;
  private _value: string;

  get value(): number {
    return stringToNumber(this._value);
  }

  set value(value: number) {
    this._value = numberToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: number) {
    this._value = numberToString(value);
  }
}

export class I64 {
  private _type: Kind = Kind.I64;
  private _value: string;

  get value(): number {
    return stringToNumber(this._value);
  }

  set value(value: number) {
    this._value = numberToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: number) {
    this._value = numberToString(value);
  }
}

export class I128 {
  private _type: Kind = Kind.I128;
  private _value: string;

  get value(): BigInt {
    return stringToBigInt(this._value);
  }

  set value(value: BigInt) {
    this._value = bigIntToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: BigInt) {
    this._value = bigIntToString(value);
  }
}

export class String {
  private _type: Kind = Kind.String;
  private _value: string;

  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    this._value = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: string) {
    this._value = value;
  }
}

export class Enum {
  private _type: Kind = Kind.Enum;
  private _variant: string;
  private _fields: globalThis.Array<Any> = [];

  public get variant(): number {
    return stringToNumber(this._variant);
  }
  public set variant(value: number) {
    this._variant = numberToString(value);
  }

  public get fields(): globalThis.Array<Any> {
    return this._fields;
  }
  public set fields(value: globalThis.Array<Any>) {
    this._fields = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(variant: number, fields: globalThis.Array<Any> = []) {
    this._variant = numberToString(variant);
    this.fields = fields;
  }
}

export class Array {
  private _type: Kind = Kind.Array;
  private _elementKind: Kind;
  private _elements: globalThis.Array<Any>;

  public get elementKind(): Kind {
    return this._elementKind;
  }
  public set elementKind(value: Kind) {
    this._elementKind = value;
  }

  public get elements(): globalThis.Array<Any> {
    return this._elements;
  }
  public set elements(value: globalThis.Array<Any>) {
    this._elements = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(elementKind: Kind, elements: globalThis.Array<Any>) {
    this._elementKind = elementKind;
    this._elements = elements;
  }
}

export class Map {
  private _type: Kind = Kind.Map;
  private _keyValueKind: Kind;
  private _valueValueKind: Kind;
  private _entries: globalThis.Array<[Any, Any]> = [];

  public get keyValueKind(): Kind {
    return this._keyValueKind;
  }
  public set keyValueKind(value: Kind) {
    this._keyValueKind = value;
  }

  public get valueValueKind(): Kind {
    return this._valueValueKind;
  }
  public set valueValueKind(value: Kind) {
    this._valueValueKind = value;
  }

  public get entries(): globalThis.Array<[Any, Any]> {
    return this._entries;
  }
  public set entries(value: globalThis.Array<[Any, Any]>) {
    this._entries = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(
    keyValueKind: Kind,
    valueValueKind: Kind,
    elements: globalThis.Array<[Any, Any]> = []
  ) {
    this._keyValueKind = keyValueKind;
    this._valueValueKind = valueValueKind;
    this._entries = elements;
  }
}

export class Tuple {
  private _type: Kind = Kind.Tuple;
  private _elements: globalThis.Array<Any> = [];

  public get elements(): globalThis.Array<Any> {
    return this._elements;
  }
  public set elements(value: globalThis.Array<Any>) {
    this._elements = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(elements: globalThis.Array<Any> = []) {
    this.elements = elements;
  }
}

export class Decimal {
  private _type: Kind = Kind.Decimal;
  private _value: string;

  get value(): BigInt {
    return stringToBigInt(this._value);
  }

  set value(value: BigInt) {
    this._value = bigIntToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: BigInt) {
    this._value = bigIntToString(value);
  }
}

export class PreciseDecimal {
  private _type: Kind = Kind.PreciseDecimal;
  private _value: string;

  get value(): BigInt {
    return stringToBigInt(this._value);
  }

  set value(value: BigInt) {
    this._value = bigIntToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: BigInt) {
    this._value = bigIntToString(value);
  }
}

export class Address {
  private _type: Kind = Kind.Address;
  private _address: string;

  public get address(): string {
    return this._address;
  }
  public set address(value: string) {
    this._address = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(address: string) {
    this._address = address;
  }
}

export class Bucket {
  private _type: Kind = Kind.Bucket;
  private _identifier: String | U32;

  public get identifier(): String | U32 {
    return this._identifier;
  }
  public set identifier(value: String | U32) {
    this._identifier = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(identifier: String | U32) {
    this._identifier = identifier;
  }
}

export class Proof {
  private _type: Kind = Kind.Proof;
  private _identifier: String | U32;

  public get identifier(): String | U32 {
    return this._identifier;
  }
  public set identifier(value: String | U32) {
    this._identifier = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(identifier: String | U32) {
    this._identifier = identifier;
  }
}

export class Expression {
  private _type: Kind = Kind.Expression;
  private _value: string;

  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    this._value = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(expression: string) {
    this._value = expression;
  }

  static entireWorktop(): Expression {
    return new Expression("ENTIRE_WORKTOP");
  }

  static entireAuthZone(): Expression {
    return new Expression("ENTIRE_AUTH_ZONE");
  }
}

export class NonFungibleLocalId {
  private _type: Kind = Kind.NonFungibleLocalId;
  private _value: UUID | Integer | String | Bytes;

  public get value(): UUID | Integer | String | Bytes {
    return this._value;
  }
  public set value(value: UUID | Integer | String | Bytes) {
    this._value = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: UUID | Integer | String | Bytes) {
    this._value = value;
  }
}

export class Integer {
  private _type: string = "Integer";
  private _value: string;

  get value(): number {
    return stringToNumber(this._value);
  }

  set value(value: number) {
    this._value = numberToString(value);
  }

  constructor(value: number) {
    this._value = numberToString(value);
  }
}

export class UUID {
  private _type: string = "UUID";
  private _value: string;

  get value(): BigInt {
    return stringToBigInt(this._value);
  }

  set value(value: BigInt) {
    this._value = bigIntToString(value);
  }

  constructor(value: BigInt) {
    this._value = bigIntToString(value);
  }
}

export class Blob {
  private _type: Kind = Kind.Blob;
  private _hash: string;

  get value(): Uint8Array {
    return stringToUint8Array(this._hash);
  }

  set value(hash: Uint8Array) {
    this._hash = uint8ArrayToString(hash);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(hash: Uint8Array) {
    this._hash = uint8ArrayToString(hash);
  }
}

export class Bytes {
  private _type: string = "Bytes";
  private _value: string;

  get value(): Uint8Array {
    return stringToUint8Array(this._value);
  }

  set value(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  public get type(): string {
    return this._type;
  }

  constructor(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }
}
