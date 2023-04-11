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

import { Decimal as DecimalJs } from "decimal.js";
import { EntityAddress } from "..";
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
import { PublicKey } from "../crypto";

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
  | Own
  | Decimal
  | PreciseDecimal
  | NonFungibleLocalId
  | Reference;

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
  Own = "Own",
  Decimal = "Decimal",
  PreciseDecimal = "PreciseDecimal",
  NonFungibleLocalId = "NonFungibleLocalId",
  Reference = "Reference",
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

export class Own {
  private _type: Kind = Kind.Own;
  private _value: Bucket | Proof | Vault | ObjectNode | KeyValueStore;

  public get type(): Kind {
    return this._type;
  }
  public set type(value: Kind) {
    this._type = value;
  }

  public get value(): Bucket | Proof | Vault | ObjectNode | KeyValueStore {
    return this._value;
  }
  public set value(value: Bucket | Proof | Vault | ObjectNode | KeyValueStore) {
    this._value = value;
  }

  constructor(value: Bucket | Proof | Vault | ObjectNode | KeyValueStore) {
    this._value = value;
  }

  toString(): string {
    return serialize(this);
  }
}

export enum OwnKind {
  Bucket = "Bucket",
  Proof = "Proof",
  Vault = "Vault",
  ObjectNode = "Object",
  KeyValueStore = "KeyValueStore",
}

export class Bucket {
  private _type: OwnKind = OwnKind.Bucket;
  private _value: string;

  public get value(): Uint8Array {
    return stringToUint8Array(this._value);
  }
  public set value(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  public get type(): OwnKind {
    return this._type;
  }

  constructor(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  toString(): string {
    return serialize(this);
  }
}

export class Proof {
  private _type: OwnKind = OwnKind.Proof;
  private _value: string;

  public get value(): Uint8Array {
    return stringToUint8Array(this._value);
  }
  public set value(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  public get type(): OwnKind {
    return this._type;
  }

  constructor(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  toString(): string {
    return serialize(this);
  }
}

export class Vault {
  private _type: OwnKind = OwnKind.Vault;
  private _value: string;

  public get value(): Uint8Array {
    return stringToUint8Array(this._value);
  }
  public set value(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  public get type(): OwnKind {
    return this._type;
  }

  constructor(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  toString(): string {
    return serialize(this);
  }
}

export class ObjectNode {
  private _type: OwnKind = OwnKind.ObjectNode;
  private _value: string;

  public get value(): Uint8Array {
    return stringToUint8Array(this._value);
  }
  public set value(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  public get type(): OwnKind {
    return this._type;
  }

  constructor(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  toString(): string {
    return serialize(this);
  }
}

export class KeyValueStore {
  private _type: OwnKind = OwnKind.KeyValueStore;
  private _value: string;

  public get value(): Uint8Array {
    return stringToUint8Array(this._value);
  }
  public set value(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  public get type(): OwnKind {
    return this._type;
  }

  constructor(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
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

  constructor(value: Uint8Array | string) {
    this._value = uint8ArrayToString(resolveBytes(value));
  }

  toString(): string {
    return serialize(this);
  }
}

export class Reference {
  private _type: Kind = Kind.Reference;
  private _value: string;

  public get value(): Uint8Array {
    return stringToUint8Array(this._value);
  }
  public set value(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  public get type(): Kind {
    return this._type;
  }

  constructor(value: Uint8Array) {
    this._value = uint8ArrayToString(value);
  }

  toString(): string {
    return serialize(this);
  }
}
