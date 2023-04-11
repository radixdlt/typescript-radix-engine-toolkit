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

// TODO: Convert U64 and I64 to use BigInt

import { Decimal as DecimalJs } from "decimal.js";
import { EntityAddress, PublicKey } from "..";
import { IAddress } from "../../base/base_address";
import {
  bigIntToString,
  decimalToString,
  numberToString,
  resolveBytes,
  serialize,
  stringToBigInt,
  stringToDecimal,
  stringToNumber,
  stringToUint8Array,
  uint8ArrayToString,
} from "../../utils";
import {
  AddressBook,
  AddressInformation,
  RadixEngineToolkit,
} from "../../wrapper/default";

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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
  }
}

export class Enum {
  private _type: Kind = Kind.Enum;
  private _variant: EnumDiscriminator;
  private _fields: globalThis.Array<Any> = [];

  public get variant(): EnumDiscriminator {
    return this._variant;
  }
  public set variant(value: EnumDiscriminator) {
    this._variant = value;
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

  constructor(variant: EnumDiscriminator, fields: globalThis.Array<Any> = []) {
    this._variant = variant;
    this.fields = fields;
  }

  toString(): string {
    return serialize(this);
  }
}

// TODO: Remove once toolkit uses regular U8 and String for the discriminator
export type EnumDiscriminator = EnumStringDiscriminator | EnumU8Discriminator;

export class EnumStringDiscriminator {
  private _type: Kind = Kind.String;
  private _discriminator: string;

  public get discriminator(): string {
    return this._discriminator;
  }
  public set discriminator(value: string) {
    this._discriminator = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(discriminator: string) {
    this._discriminator = discriminator;
  }

  toString(): string {
    return serialize(this);
  }
}

export class EnumU8Discriminator {
  private _type: Kind = Kind.U8;
  private _discriminator: string;

  public get discriminator(): string {
    return this._discriminator;
  }
  public set discriminator(value: string) {
    this._discriminator = value;
  }

  get value(): number {
    return stringToNumber(this._discriminator);
  }

  set value(value: number) {
    this._discriminator = numberToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: number) {
    this._discriminator = numberToString(value);
  }

  toString(): string {
    return serialize(this);
  }
}

export class Some {
  private _type: Kind = Kind.Some;
  private _value: Any;

  public get value(): Any {
    return this._value;
  }
  public set value(value: Any) {
    this._value = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: Any) {
    this._value = value;
  }

  toString(): string {
    return serialize(this);
  }
}

export class None {
  private _type: Kind = Kind.None;

  public get type(): Kind {
    return this._type;
  }

  constructor() {}
}

export class Ok {
  private _type: Kind = Kind.Ok;
  private _value: Any;

  public get value(): Any {
    return this._value;
  }
  public set value(value: Any) {
    this._value = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: Any) {
    this._value = value;
  }

  toString(): string {
    return serialize(this);
  }
}

export class Err {
  private _type: Kind = Kind.Err;
  private _value: Any;

  public get value(): Any {
    return this._value;
  }
  public set value(value: Any) {
    this._value = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: Any) {
    this._value = value;
  }

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
  }
}

export class Decimal {
  private _type: Kind = Kind.Decimal;
  private _value: string;

  get value(): DecimalJs {
    return stringToDecimal(this._value);
  }

  set value(value: DecimalJs | string | number) {
    if (typeof value === "string") {
      this._value = value;
    } else if (typeof value === "number") {
      this._value = numberToString(value);
    } else if (value instanceof DecimalJs) {
      this._value = decimalToString(value);
    } else {
      throw new TypeError("Invalid type passed as decimal");
    }
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: DecimalJs | string | number) {
    if (typeof value === "string") {
      this._value = value;
    } else if (typeof value === "number") {
      this._value = numberToString(value);
    } else if (value instanceof DecimalJs) {
      this._value = decimalToString(value);
    } else {
      throw new TypeError("Invalid type passed as decimal");
    }
  }

  toString(): string {
    return serialize(this);
  }
}

export class PreciseDecimal {
  private _type: Kind = Kind.PreciseDecimal;
  private _value: string;

  get value(): DecimalJs {
    return stringToDecimal(this._value);
  }

  set value(value: DecimalJs | string | number) {
    if (typeof value === "string") {
      this._value = value;
    } else if (typeof value === "number") {
      this._value = numberToString(value);
    } else if (value instanceof DecimalJs) {
      this._value = decimalToString(value);
    } else {
      throw new TypeError("Invalid type passed as decimal");
    }
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: DecimalJs | string | number) {
    if (typeof value === "string") {
      this._value = value;
    } else if (typeof value === "number") {
      this._value = numberToString(value);
    } else if (value instanceof DecimalJs) {
      this._value = decimalToString(value);
    } else {
      throw new TypeError("Invalid type passed as decimal");
    }
  }

  toString(): string {
    return serialize(this);
  }
}

export class Address implements IAddress {
  private _type: Kind = Kind.Address;
  private _address: string;

  public get type(): Kind {
    return this._type;
  }

  public get address(): string {
    return this._address;
  }
  public set address(value: string) {
    this._address = value;
  }

  constructor(address: string) {
    this._address = address;
  }

  static async virtualAccountAddress(
    publicKey: PublicKey.Any,
    networkId: number
  ): Promise<Address> {
    return RadixEngineToolkit.deriveVirtualAccountAddress(
      publicKey,
      networkId
    ).then((address) => new Address(address));
  }

  static async virtualIdentityAddress(
    publicKey: PublicKey.Any,
    networkId: number
  ): Promise<Address> {
    return RadixEngineToolkit.deriveVirtualIdentityAddress(
      publicKey,
      networkId
    ).then((address) => new Address(address));
  }

  static async fromOlympiaAccountAddress(
    olympiaAccountAddress: string,
    networkId: number
  ): Promise<Address> {
    return RadixEngineToolkit.deriveBabylonAddressFromOlympiaAddress(
      olympiaAccountAddress,
      networkId
    ).then(({ babylonAccountAddress }) => new Address(babylonAccountAddress));
  }

  static async decode(
    bytes: Uint8Array | string,
    networkId: number
  ): Promise<Address> {
    return RadixEngineToolkit.encodeAddress(bytes, networkId).then(
      (response) => new Address(response)
    );
  }

  static async faucetComponentAddress(networkId: number): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(({ faucetComponentAddress }) => faucetComponentAddress)
      .then((address) => new Address(address));
  }
  static async faucetPackageAddress(networkId: number): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(({ faucetPackageAddress }) => faucetPackageAddress)
      .then((address) => new Address(address));
  }
  static async accountPackageAddress(networkId: number): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(({ accountPackageAddress }) => accountPackageAddress)
      .then((address) => new Address(address));
  }
  static async xrdResourceAddress(networkId: number): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(({ xrdResourceAddress }) => xrdResourceAddress)
      .then((address) => new Address(address));
  }
  static async systemTokenResourceAddress(networkId: number): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(({ systemTokenResourceAddress }) => systemTokenResourceAddress)
      .then((address) => new Address(address));
  }
  static async ecdsaSecp256k1TokenResourceAddress(
    networkId: number
  ): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(
        ({ ecdsaSecp256k1TokenResourceAddress }) =>
          ecdsaSecp256k1TokenResourceAddress
      )
      .then((address) => new Address(address));
  }
  static async eddsaEd25519TokenResourceAddress(
    networkId: number
  ): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(
        ({ eddsaEd25519TokenResourceAddress }) =>
          eddsaEd25519TokenResourceAddress
      )
      .then((address) => new Address(address));
  }
  static async packageTokenResourceAddress(
    networkId: number
  ): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(({ packageTokenResourceAddress }) => packageTokenResourceAddress)
      .then((address) => new Address(address));
  }
  static async epochManagerComponentAddress(
    networkId: number
  ): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(({ epochManagerComponentAddress }) => epochManagerComponentAddress)
      .then((address) => new Address(address));
  }
  static async clockComponentAddress(networkId: number): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(({ clockComponentAddress }) => clockComponentAddress)
      .then((address) => new Address(address));
  }

  async networkId(): Promise<number> {
    return (await this.addressInformation()).networkId;
  }

  async networkName(): Promise<string> {
    return (await this.addressInformation()).networkName;
  }

  async entityType(): Promise<EntityAddress.EntityType> {
    return (await this.addressInformation()).entityType;
  }

  async data(): Promise<Uint8Array> {
    return (await this.addressInformation()).data;
  }

  async hrp(): Promise<string> {
    return (await this.addressInformation()).hrp;
  }

  private static async knownEntityAddresses(
    networkId: number
  ): Promise<AddressBook> {
    return RadixEngineToolkit.knownEntityAddresses(networkId);
  }

  private async addressInformation(): Promise<AddressInformation> {
    return RadixEngineToolkit.decodeAddress(this.address);
  }

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
  }
}

export class NonFungibleGlobalId {
  private _type: Kind = Kind.NonFungibleGlobalId;
  private _resourceAddress: Address;
  private _nonFungibleLocalId: NonFungibleLocalId;

  public get resourceAddress(): Address {
    return this._resourceAddress;
  }
  public set resourceAddress(value: Address) {
    this._resourceAddress = value;
  }

  public get nonFungibleLocalId(): NonFungibleLocalId {
    return this._nonFungibleLocalId;
  }
  public set nonFungibleLocalId(value: NonFungibleLocalId) {
    this._nonFungibleLocalId = value;
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(
    resourceAddress: Address,
    nonFungibleLocalId: NonFungibleLocalId
  ) {
    this._resourceAddress = resourceAddress;
    this._nonFungibleLocalId = nonFungibleLocalId;
  }

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  toString(): string {
    return serialize(this);
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

  constructor(hash: Uint8Array | string) {
    this._hash = uint8ArrayToString(resolveBytes(hash));
  }

  toString(): string {
    return serialize(this);
  }
}

export class Bytes {
  private _type: Kind = Kind.Bytes;
  private _value: string;

  get value(): Uint8Array {
    return stringToUint8Array(this._value);
  }

  set value(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: Uint8Array | string) {
    this._value = uint8ArrayToString(resolveBytes(value));
  }

  toString(): string {
    return serialize(this);
  }
}
