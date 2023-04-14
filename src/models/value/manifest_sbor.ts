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

import {
  ClassConstructor,
  Expose,
  Transform,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer";
import { Decimal as DecimalJs } from "decimal.js";
import { EntityAddress } from "..";
import { Convert } from "../..";
import { IAddress } from "../../base/base_address";
import {
  AddressBook,
  AddressInformation,
  RadixEngineToolkit,
} from "../../wrapper/default";
import { PublicKey } from "../crypto";
import * as Serializers from "../serializers";

export abstract class Value {
  readonly type: Kind;

  constructor(type: Kind) {
    this.type = type;
  }

  abstract toString(): string;
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
  Bucket = "Bucket",
  Proof = "Proof",
  Decimal = "Decimal",
  PreciseDecimal = "PreciseDecimal",
  NonFungibleLocalId = "NonFungibleLocalId",
  Expression = "Expression",
  Blob = "Blob",
}

export class Bool extends Value {
  @Expose()
  value: boolean;

  constructor(value: boolean) {
    super(Kind.Bool);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class U8 extends Value {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  value: number;

  constructor(value: number) {
    super(Kind.U8);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class U16 extends Value {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  value: number;

  constructor(value: number) {
    super(Kind.U16);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class U32 extends Value {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  value: number;

  constructor(value: number) {
    super(Kind.U32);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class U64 extends Value {
  @Expose()
  @Transform(Serializers.BigIntAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.BigIntAsString.deserialize, {
    toClassOnly: true,
  })
  value: bigint;

  constructor(value: bigint) {
    super(Kind.U64);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class U128 extends Value {
  @Expose()
  @Transform(Serializers.BigIntAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.BigIntAsString.deserialize, {
    toClassOnly: true,
  })
  value: bigint;

  constructor(value: bigint) {
    super(Kind.U128);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class I8 extends Value {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  value: number;

  constructor(value: number) {
    super(Kind.I8);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class I16 extends Value {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  value: number;

  constructor(value: number) {
    super(Kind.I16);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class I32 extends Value {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  value: number;

  constructor(value: number) {
    super(Kind.I32);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class I64 extends Value {
  @Expose()
  @Transform(Serializers.BigIntAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.BigIntAsString.deserialize, {
    toClassOnly: true,
  })
  value: bigint;

  constructor(value: bigint) {
    super(Kind.I64);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class I128 extends Value {
  @Expose()
  @Transform(Serializers.BigIntAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.BigIntAsString.deserialize, {
    toClassOnly: true,
  })
  value: bigint;

  constructor(value: bigint) {
    super(Kind.I128);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class String extends Value {
  @Expose()
  value: string;

  constructor(value: string) {
    super(Kind.String);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Enum extends Value {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  variant: number;

  @Expose({ name: "fields" })
  @Type(() => Object)
  private internalFields: globalThis.Array<Object> = [];

  get fields(): globalThis.Array<Value> {
    return this.internalFields.map(resolveValue);
  }

  set fields(fields: globalThis.Array<Value>) {
    this.internalFields = fields.map((instance) => instanceToPlain(instance));
  }

  constructor(variant: number, fields: globalThis.Array<Value> = []) {
    super(Kind.Enum);
    this.variant = variant;
    this.internalFields = fields?.map((instance) => instanceToPlain(instance));
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Array extends Value {
  @Expose({ name: "element_kind" })
  elementKind: Kind;

  @Expose({ name: "elements" })
  @Type(() => Object)
  internalElements: globalThis.Array<Object>;

  get elements(): globalThis.Array<Value> {
    return this.internalElements.map(resolveValue);
  }

  set elements(elements: globalThis.Array<Value>) {
    this.internalElements = elements.map((instance) =>
      instanceToPlain(instance)
    );
  }

  constructor(elementKind: Kind, elements: globalThis.Array<Value>) {
    super(Kind.Array);
    this.elementKind = elementKind;
    this.internalElements = elements?.map((instance) =>
      instanceToPlain(instance)
    );
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Map extends Value {
  @Expose({ name: "key_value_kind" })
  keyValueKind: Kind;

  @Expose({ name: "value_value_kind" })
  valueValueKind: Kind;

  @Expose({ name: "entries" })
  @Type(() => Object)
  internalEntries: globalThis.Array<[Object, Object]>;

  get entries(): globalThis.Array<[Value, Value]> {
    return this.internalEntries.map(([key, value]) => [
      resolveValue(key),
      resolveValue(value),
    ]);
  }

  set entries(entries: globalThis.Array<[Value, Value]>) {
    this.internalEntries = entries.map(([key, value]) => [
      instanceToPlain(key),
      instanceToPlain(value),
    ]);
  }

  constructor(
    keyValueKind: Kind,
    valueValueKind: Kind,
    entries: globalThis.Array<[Value, Value]> = []
  ) {
    super(Kind.Map);
    this.keyValueKind = keyValueKind;
    this.valueValueKind = valueValueKind;
    this.internalEntries = entries?.map(([key, value]) => [
      instanceToPlain(key),
      instanceToPlain(value),
    ]);
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Tuple extends Value {
  @Expose({ name: "elements" })
  @Type(() => Object)
  internalElements: globalThis.Array<Object>;

  get elements(): globalThis.Array<Value> {
    return this.internalElements.map(resolveValue);
  }

  set elements(elements: globalThis.Array<Value>) {
    this.internalElements = elements.map((instance) =>
      instanceToPlain(instance)
    );
  }

  constructor(elements: globalThis.Array<Value>) {
    super(Kind.Tuple);
    this.internalElements = elements?.map((instance) =>
      instanceToPlain(instance)
    );
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Decimal extends Value {
  @Expose()
  @Type(() => DecimalJs)
  @Transform(Serializers.DecimalAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.DecimalAsString.deserialize, {
    toClassOnly: true,
  })
  value: DecimalJs;

  constructor(value: DecimalJs | string | number) {
    super(Kind.Decimal);
    if (value == null || value == undefined) {
      this.value = new DecimalJs(0);
    } else if (typeof value === "string") {
      this.value = new DecimalJs(value);
    } else if (typeof value === "number") {
      this.value = new DecimalJs(value);
    } else if (value instanceof DecimalJs) {
      this.value = value;
    } else {
      throw new TypeError("Invalid type passed as decimal");
    }
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class PreciseDecimal extends Value {
  @Expose()
  @Type(() => DecimalJs)
  @Transform(Serializers.DecimalAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.DecimalAsString.deserialize, {
    toClassOnly: true,
  })
  value: DecimalJs;

  constructor(value: DecimalJs | string | number) {
    super(Kind.PreciseDecimal);
    if (value == null || value == undefined) {
      this.value = new DecimalJs(0);
    } else if (typeof value === "string") {
      this.value = new DecimalJs(value);
    } else if (typeof value === "number") {
      this.value = new DecimalJs(value);
    } else if (value instanceof DecimalJs) {
      this.value = value;
    } else {
      throw new TypeError("Invalid type passed as decimal");
    }
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Address extends Value implements IAddress {
  @Expose()
  address: string;

  constructor(address: string) {
    super(Kind.Address);
    this.address = address;
  }

  static async virtualAccountAddress(
    publicKey: PublicKey.PublicKey,
    networkId: number
  ): Promise<Address> {
    return RadixEngineToolkit.deriveVirtualAccountAddress(
      publicKey,
      networkId
    ).then((address) => new Address(address));
  }

  static async virtualIdentityAddress(
    publicKey: PublicKey.PublicKey,
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
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Bucket extends Value {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  identifier: number;

  constructor(identifier: number) {
    super(Kind.Bucket);
    this.identifier = identifier;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Proof extends Value {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  identifier: number;

  constructor(identifier: number) {
    super(Kind.Proof);
    this.identifier = identifier;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Expression extends Value {
  value: string;

  constructor(expression: string) {
    super(Kind.Expression);
    this.value = expression;
  }

  static entireWorktop(): Expression {
    return new Expression("ENTIRE_WORKTOP");
  }

  static entireAuthZone(): Expression {
    return new Expression("ENTIRE_AUTH_ZONE");
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Integer {
  @Expose()
  readonly type: string = "Integer";

  @Expose()
  @Transform(Serializers.BigIntAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.BigIntAsString.deserialize, {
    toClassOnly: true,
  })
  value: bigint;

  constructor(value: bigint) {
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class UUID {
  @Expose()
  readonly type: string = "UUID";

  @Expose()
  @Transform(Serializers.BigIntAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.BigIntAsString.deserialize, {
    toClassOnly: true,
  })
  value: bigint;

  constructor(value: bigint) {
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Bytes {
  readonly type: string = "Bytes";

  @Expose()
  @Type(() => Uint8Array)
  @Transform(Serializers.ByteArrayAsHexString.serialize, { toPlainOnly: true })
  @Transform(Serializers.ByteArrayAsHexString.deserialize, {
    toClassOnly: true,
  })
  value: Uint8Array;

  constructor(value: Uint8Array | string) {
    this.value = Convert.Uint8Array.from(value);
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Blob extends Value {
  @Expose()
  @Type(() => Uint8Array)
  @Transform(Serializers.ByteArrayAsHexString.serialize, { toPlainOnly: true })
  @Transform(Serializers.ByteArrayAsHexString.deserialize, {
    toClassOnly: true,
  })
  hash: Uint8Array;

  constructor(hash: Uint8Array | string) {
    super(Kind.Blob);
    this.hash = Convert.Uint8Array.from(hash);
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class NonFungibleLocalId extends Value {
  @Expose()
  @Type(() => Object, {
    discriminator: {
      property: "type",
      subTypes: [
        { name: "UUID", value: UUID },
        { name: "Integer", value: Integer },
        { name: "String", value: String },
        { name: "Bytes", value: Bytes },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  value: UUID | Integer | String | Bytes;

  constructor(value: UUID | Integer | String | Bytes) {
    super(Kind.NonFungibleLocalId);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

function resolveValue(object: Object): Value {
  let resolveSingleFn = <T>(object: Object, Class: ClassConstructor<T>): T =>
    plainToInstance(Class, instanceToPlain(object));
  let type: Kind = (object as Value).type;

  switch (type) {
    case Kind.Bool:
      return resolveSingleFn(object, Bool);
    case Kind.U8:
      return resolveSingleFn(object, U8);
    case Kind.U16:
      return resolveSingleFn(object, U16);
    case Kind.U32:
      return resolveSingleFn(object, U32);
    case Kind.U64:
      return resolveSingleFn(object, U64);
    case Kind.U128:
      return resolveSingleFn(object, U128);
    case Kind.I8:
      return resolveSingleFn(object, I8);
    case Kind.I16:
      return resolveSingleFn(object, I16);
    case Kind.I32:
      return resolveSingleFn(object, I32);
    case Kind.I64:
      return resolveSingleFn(object, I64);
    case Kind.I128:
      return resolveSingleFn(object, I128);
    case Kind.String:
      return resolveSingleFn(object, String);
    case Kind.Enum:
      return resolveSingleFn(object, Enum);
    case Kind.Array:
      return resolveSingleFn(object, Array);
    case Kind.Map:
      return resolveSingleFn(object, Map);
    case Kind.Tuple:
      return resolveSingleFn(object, Tuple);
    case Kind.Address:
      return resolveSingleFn(object, Address);
    case Kind.Bucket:
      return resolveSingleFn(object, Bucket);
    case Kind.Proof:
      return resolveSingleFn(object, Proof);
    case Kind.Decimal:
      return resolveSingleFn(object, Decimal);
    case Kind.PreciseDecimal:
      return resolveSingleFn(object, PreciseDecimal);
    case Kind.NonFungibleLocalId:
      return resolveSingleFn(object, NonFungibleLocalId);
    case Kind.Expression:
      return resolveSingleFn(object, Expression);
    case Kind.Blob:
      return resolveSingleFn(object, Blob);
  }
}
