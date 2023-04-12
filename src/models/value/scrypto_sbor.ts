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
  uint8ArrayToString,
} from "../../utils";
import {
  AddressBook,
  AddressInformation,
  RadixEngineToolkit,
} from "../../wrapper/default";
import { PublicKey } from "../crypto";
import { ISborValueConvertible, ScryptoSbor } from "./sbor";

export abstract class Value implements ISborValueConvertible {
  readonly type: Kind;

  constructor(type: Kind) {
    this.type = type;
  }

  abstract toString(): string;

  toSborValue(): ScryptoSbor {
    return new ScryptoSbor(this);
  }
}

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

export class Bool extends Value {
  value: boolean;

  constructor(value: boolean) {
    super(Kind.Bool);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class U8 extends Value {
  value: string;

  constructor(value: number) {
    super(Kind.U8);
    this.value = numberToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class U16 extends Value {
  value: string;

  constructor(value: number) {
    super(Kind.U16);
    this.value = numberToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class U32 extends Value {
  value: string;

  constructor(value: number) {
    super(Kind.U32);
    this.value = numberToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class U64 extends Value {
  value: string;

  constructor(value: number) {
    super(Kind.U64);
    this.value = numberToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class U128 extends Value {
  value: string;

  constructor(value: BigInt) {
    super(Kind.U128);
    this.value = bigIntToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class I8 extends Value {
  value: string;

  constructor(value: number) {
    super(Kind.I8);
    this.value = numberToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class I16 extends Value {
  value: string;

  constructor(value: number) {
    super(Kind.I16);
    this.value = numberToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class I32 extends Value {
  value: string;

  constructor(value: number) {
    super(Kind.I32);
    this.value = numberToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class I64 extends Value {
  value: string;

  constructor(value: number) {
    super(Kind.I64);
    this.value = numberToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class I128 extends Value {
  value: string;

  constructor(value: BigInt) {
    super(Kind.I128);
    this.value = bigIntToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class String extends Value {
  value: string;

  constructor(value: string) {
    super(Kind.String);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Enum extends Value {
  variant: string;
  fields: globalThis.Array<Value> = [];

  constructor(variant: number, fields: globalThis.Array<Value> = []) {
    super(Kind.Enum);
    this.variant = numberToString(variant);
    this.fields = fields;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Array extends Value {
  elementKind: Kind;
  elements: globalThis.Array<Value>;

  constructor(elementKind: Kind, elements: globalThis.Array<Value>) {
    super(Kind.Array);
    this.elementKind = elementKind;
    this.elements = elements;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Map extends Value {
  keyValueKind: Kind;
  valueValueKind: Kind;
  entries: globalThis.Array<[Value, Value]> = [];

  constructor(
    keyValueKind: Kind,
    valueValueKind: Kind,
    elements: globalThis.Array<[Value, Value]> = []
  ) {
    super(Kind.Map);
    this.keyValueKind = keyValueKind;
    this.valueValueKind = valueValueKind;
    this.entries = elements;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Tuple extends Value {
  elements: globalThis.Array<Value> = [];

  constructor(elements: globalThis.Array<Value> = []) {
    super(Kind.Tuple);
    this.elements = elements;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Decimal extends Value {
  value: string;

  set value(value: DecimalJs | string | number) {
    if (typeof value === "string") {
      this.value = value;
    } else if (typeof value === "number") {
      this.value = numberToString(value);
    } else if (value instanceof DecimalJs) {
      this.value = decimalToString(value);
    } else {
      throw new TypeError("Invalid type passed as decimal");
    }
  }

  constructor(value: DecimalJs | string | number) {
    super(Kind.Decimal);
    if (typeof value === "string") {
      this.value = value;
    } else if (typeof value === "number") {
      this.value = numberToString(value);
    } else if (value instanceof DecimalJs) {
      this.value = decimalToString(value);
    } else {
      throw new TypeError("Invalid type passed as decimal");
    }
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class PreciseDecimal extends Value {
  value: string;

  set value(value: DecimalJs | string | number) {
    if (typeof value === "string") {
      this.value = value;
    } else if (typeof value === "number") {
      this.value = numberToString(value);
    } else if (value instanceof DecimalJs) {
      this.value = decimalToString(value);
    } else {
      throw new TypeError("Invalid type passed as decimal");
    }
  }

  constructor(value: DecimalJs | string | number) {
    super(Kind.PreciseDecimal);
    if (typeof value === "string") {
      this.value = value;
    } else if (typeof value === "number") {
      this.value = numberToString(value);
    } else if (value instanceof DecimalJs) {
      this.value = decimalToString(value);
    } else {
      throw new TypeError("Invalid type passed as decimal");
    }
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Address extends Value implements IAddress {
  address: string;

  constructor(address: string) {
    super(Kind.Address);
    this.address = address;
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
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Own extends Value {
  value: Bucket | Proof | Vault | ObjectNode | KeyValueStore;

  constructor(value: Bucket | Proof | Vault | ObjectNode | KeyValueStore) {
    super(Kind.Own);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
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
  readonly type: OwnKind = OwnKind.Bucket;
  value: string;

  constructor(value: Uint8Array) {
    this.value = uint8ArrayToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Proof {
  readonly type: OwnKind = OwnKind.Proof;
  value: string;

  constructor(value: Uint8Array) {
    this.value = uint8ArrayToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Vault {
  readonly type: OwnKind = OwnKind.Vault;
  value: string;

  constructor(value: Uint8Array) {
    this.value = uint8ArrayToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class ObjectNode {
  readonly type: OwnKind = OwnKind.ObjectNode;
  value: string;

  constructor(value: Uint8Array) {
    this.value = uint8ArrayToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class KeyValueStore {
  readonly type: OwnKind = OwnKind.KeyValueStore;
  value: string;

  constructor(value: Uint8Array) {
    this.value = uint8ArrayToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class NonFungibleLocalId extends Value {
  value: UUID | Integer | String | Bytes;

  constructor(value: UUID | Integer | String | Bytes) {
    super(Kind.NonFungibleLocalId);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Integer {
  readonly type: string = "Integer";
  value: string;

  constructor(value: number) {
    this.value = numberToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class UUID {
  readonly type: string = "UUID";
  value: string;

  constructor(value: BigInt) {
    this.value = bigIntToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Bytes {
  readonly type: string = "Bytes";
  value: string;

  constructor(value: Uint8Array | string) {
    this.value = uint8ArrayToString(resolveBytes(value));
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Reference extends Value {
  value: string;

  constructor(value: Uint8Array) {
    super(Kind.Reference);
    this.value = uint8ArrayToString(value);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}
