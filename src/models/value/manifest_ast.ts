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
import { EntityType, PublicKey } from "..";
import { Convert } from "../..";
import { IAddress } from "../../base/base_address";
import {
  AddressBook,
  AddressInformation,
  RadixEngineToolkit,
} from "../../wrapper/default";
import * as Serializers from "../serializers";

export abstract class Value {
  readonly kind: Kind;

  constructor(type: Kind) {
    this.kind = type;
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

export class Bool extends Value {
  @Expose()
  value: boolean;

  constructor(value: boolean) {
    super(Kind.Bool);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class EnumDiscriminator {
  readonly type: "String" | "U8";

  constructor(type: "String" | "U8") {
    this.type = type;
  }
}

export class EnumStringDiscriminator extends EnumDiscriminator {
  @Expose()
  discriminator: string;

  constructor(discriminator: string) {
    super("String");
    this.discriminator = discriminator;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class EnumU8Discriminator extends EnumDiscriminator {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  discriminator: number;

  constructor(value: number) {
    super("U8");
    this.discriminator = value;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Enum extends Value {
  @Expose()
  @Type(() => EnumDiscriminator, {
    discriminator: {
      property: "type",
      subTypes: [
        { name: "String", value: EnumStringDiscriminator },
        { name: "U8", value: EnumU8Discriminator },
      ],
    },
  })
  variant: EnumDiscriminator;

  @Expose({ name: "fields" })
  @Type(() => Object)
  private internalFields: globalThis.Array<Object> = [];

  get fields(): globalThis.Array<Value> {
    return this.internalFields.map(resolveValue);
  }

  set fields(fields: globalThis.Array<Value>) {
    this.internalFields = fields.map((instance) => instanceToPlain(instance));
  }

  constructor(
    variant: EnumDiscriminator,
    fields: globalThis.Array<Value> = []
  ) {
    super(Kind.Enum);
    this.variant = variant;
    this.internalFields = fields?.map((instance) => instanceToPlain(instance));
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Some extends Value {
  @Expose({ name: "value" })
  @Type(() => Object)
  private internalValue: Object;

  get value(): Value {
    return resolveValue(this.internalValue);
  }

  set value(value: Value) {
    this.internalValue = instanceToPlain(value);
  }

  constructor(value: Value) {
    super(Kind.Some);
    this.internalValue = instanceToPlain(value);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class None extends Value {
  constructor() {
    super(Kind.None);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Ok extends Value {
  @Expose({ name: "value" })
  @Type(() => Object)
  private internalValue: Object;

  get value(): Value {
    return resolveValue(this.internalValue);
  }

  set value(value: Value) {
    this.internalValue = instanceToPlain(value);
  }

  constructor(value: Value) {
    super(Kind.Ok);
    this.internalValue = instanceToPlain(value);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Err extends Value {
  @Expose({ name: "value" })
  @Type(() => Object)
  private internalValue: Object;

  get value(): Value {
    return resolveValue(this.internalValue);
  }

  set value(value: Value) {
    this.internalValue = instanceToPlain(value);
  }

  constructor(value: Value) {
    super(Kind.Err);
    this.internalValue = instanceToPlain(value);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Map extends Value {
  @Expose({ name: "key_kind" })
  keyValueKind: Kind;

  @Expose({ name: "value_kind" })
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Tuple extends Value {
  @Expose({ name: "fields" })
  @Type(() => Object)
  internalFields: globalThis.Array<Object>;

  get fields(): globalThis.Array<Value> {
    return this.internalFields.map(resolveValue);
  }

  set fields(elements: globalThis.Array<Value>) {
    this.internalFields = elements.map((instance) => instanceToPlain(instance));
  }

  constructor(elements: globalThis.Array<Value>) {
    super(Kind.Tuple);
    this.internalFields = elements?.map((instance) =>
      instanceToPlain(instance)
    );
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Address extends Value implements IAddress {
  @Expose()
  value: string;

  constructor(address: string) {
    super(Kind.Address);
    this.value = address;
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
      (output) => new Address(output)
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
  static async consensusManagerComponentAddress(
    networkId: number
  ): Promise<Address> {
    return Address.knownEntityAddresses(networkId)
      .then(
        ({ consensusManagerComponentAddress }) =>
          consensusManagerComponentAddress
      )
      .then((address) => new Address(address));
  }

  async networkId(): Promise<number> {
    return (await this.addressInformation()).networkId;
  }

  async networkName(): Promise<string> {
    return (await this.addressInformation()).networkName;
  }

  async entityType(): Promise<EntityType> {
    return (await this.addressInformation()).entityType;
  }

  async data(): Promise<Uint8Array> {
    return (await this.addressInformation()).data;
  }

  private static async knownEntityAddresses(
    networkId: number
  ): Promise<AddressBook> {
    return RadixEngineToolkit.knownEntityAddresses(networkId);
  }

  private async addressInformation(): Promise<AddressInformation> {
    return RadixEngineToolkit.decodeAddress(this.value);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Bucket extends Value {
  @Expose()
  @Type(() => String)
  value: string;

  constructor(identifier: string) {
    super(Kind.Bucket);
    this.value = identifier;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Proof extends Value {
  @Expose()
  @Type(() => String)
  value: string;

  constructor(identifier: string) {
    super(Kind.Proof);
    this.value = identifier;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Expression extends Value {
  @Expose()
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
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
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
  value: Uint8Array;

  constructor(hash: Uint8Array | string) {
    super(Kind.Blob);
    this.value = Convert.Uint8Array.from(hash);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class Bytes extends Value {
  @Expose()
  @Type(() => Uint8Array)
  @Transform(Serializers.ByteArrayAsHexString.serialize, { toPlainOnly: true })
  @Transform(Serializers.ByteArrayAsHexString.deserialize, {
    toClassOnly: true,
  })
  hex: Uint8Array;

  constructor(value: Uint8Array | string) {
    super(Kind.Bytes);
    this.hex = Convert.Uint8Array.from(value);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class NonFungibleLocalId extends Value {
  @Expose()
  @Type(() => String)
  value: string;

  constructor(value: string) {
    super(Kind.NonFungibleLocalId);
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class NonFungibleGlobalId extends Value {
  @Expose({ name: "resource_address" })
  @Type(() => Address)
  resourceAddress: Address;

  @Expose({ name: "non_fungible_local_id" })
  @Type(() => NonFungibleLocalId)
  nonFungibleLocalId: NonFungibleLocalId;

  constructor(
    resourceAddress: Address,
    nonFungibleLocalId: NonFungibleLocalId
  ) {
    super(Kind.NonFungibleGlobalId);
    this.resourceAddress = resourceAddress;
    this.nonFungibleLocalId = nonFungibleLocalId;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

function resolveValue(object: Object): Value {
  const resolveSingleFn = <T>(object: Object, Class: ClassConstructor<T>): T =>
    plainToInstance(Class, instanceToPlain(object));
  const type: Kind = (object as Value).kind;

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
    case Kind.Some:
      return resolveSingleFn(object, Some);
    case Kind.None:
      return resolveSingleFn(object, None);
    case Kind.Ok:
      return resolveSingleFn(object, Ok);
    case Kind.Err:
      return resolveSingleFn(object, Err);
    case Kind.Array:
      return resolveSingleFn(object, Array);
    case Kind.Map:
      return resolveSingleFn(object, Map);
    case Kind.Tuple:
      return resolveSingleFn(object, Tuple);
    case Kind.Decimal:
      return resolveSingleFn(object, Decimal);
    case Kind.PreciseDecimal:
      return resolveSingleFn(object, PreciseDecimal);
    case Kind.Address:
      return resolveSingleFn(object, Address);
    case Kind.Bucket:
      return resolveSingleFn(object, Bucket);
    case Kind.Proof:
      return resolveSingleFn(object, Proof);
    case Kind.NonFungibleLocalId:
      return resolveSingleFn(object, NonFungibleLocalId);
    case Kind.NonFungibleGlobalId:
      return resolveSingleFn(object, NonFungibleGlobalId);
    case Kind.Expression:
      return resolveSingleFn(object, Expression);
    case Kind.Blob:
      return resolveSingleFn(object, Blob);
    case Kind.Bytes:
      return resolveSingleFn(object, Bytes);
  }
}
