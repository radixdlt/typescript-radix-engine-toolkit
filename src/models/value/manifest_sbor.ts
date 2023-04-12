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

import {
  Expose,
  Transform,
  Type,
  TypeOptions,
  instanceToPlain,
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
import { ISborValueConvertible, ManifestSbor } from "./sbor";

export let valueTypeOptions: TypeOptions = {
  discriminator: {
    property: "type",
    subTypes: [],
  },
};

export abstract class Value implements ISborValueConvertible {
  readonly type: Kind;

  constructor(type: Kind) {
    this.type = type;
  }

  abstract toString(): string;

  toSborValue(): ManifestSbor {
    return new ManifestSbor(this);
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Enum extends Value {
  @Expose()
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  variant: number;

  @Expose()
  @Type(() => Value, valueTypeOptions)
  fields: globalThis.Array<Value> = [];

  constructor(variant: number, fields: globalThis.Array<Value> = []) {
    super(Kind.Enum);
    this.variant = variant;
    this.fields = fields;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class Array extends Value {
  @Expose({ name: "element_kind" })
  elementKind: Kind;

  @Expose()
  @Type(() => Value, valueTypeOptions)
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
  @Expose({ name: "key_value_kind" })
  keyValueKind: Kind;

  @Expose({ name: "value_value_kind" })
  valueValueKind: Kind;

  @Expose({ name: "entries" })
  @Type(() => Value, valueTypeOptions)
  entries: globalThis.Array<Value> = [];

  constructor(
    keyValueKind: Kind,
    valueValueKind: Kind,
    elements: globalThis.Array<Value> = []
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
  @Expose()
  @Type(() => Value, valueTypeOptions)
  elements: globalThis.Array<Value>;

  constructor(elements: globalThis.Array<Value> = []) {
    super(Kind.Tuple);
    this.elements = elements;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
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
    return JSON.stringify(instanceToPlain(this));
  }
}

valueTypeOptions.discriminator!.subTypes = [
  { name: "Bool", value: Bool },
  { name: "U8", value: U8 },
  { name: "U16", value: U16 },
  { name: "U32", value: U32 },
  { name: "U64", value: U64 },
  { name: "U128", value: U128 },
  { name: "I8", value: I8 },
  { name: "I16", value: I16 },
  { name: "I32", value: I32 },
  { name: "I64", value: I64 },
  { name: "I128", value: I128 },
  { name: "String", value: String },
  { name: "Enum", value: Enum },
  { name: "Array", value: Array },
  { name: "Map", value: Map },
  { name: "Tuple", value: Tuple },
  { name: "Address", value: Address },
  { name: "Bucket", value: Bucket },
  { name: "Proof", value: Proof },
  { name: "Decimal", value: Decimal },
  { name: "PreciseDecimal", value: PreciseDecimal },
  { name: "NonFungibleLocalId", value: NonFungibleLocalId },
  { name: "Expression", value: Expression },
  { name: "Blob", value: Blob },
];
