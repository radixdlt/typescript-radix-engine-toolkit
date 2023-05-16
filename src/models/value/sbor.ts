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

import { Expose, Type, TypeOptions, instanceToPlain } from "class-transformer";
import { ManifestSborValue, ScryptoSborValue } from "./index";

const manifestSborValueTypeOptions: TypeOptions = {
  discriminator: {
    property: "kind",
    subTypes: [
      { name: "Bool", value: ManifestSborValue.Bool },
      { name: "U8", value: ManifestSborValue.U8 },
      { name: "U16", value: ManifestSborValue.U16 },
      { name: "U32", value: ManifestSborValue.U32 },
      { name: "U64", value: ManifestSborValue.U64 },
      { name: "U128", value: ManifestSborValue.U128 },
      { name: "I8", value: ManifestSborValue.I8 },
      { name: "I16", value: ManifestSborValue.I16 },
      { name: "I32", value: ManifestSborValue.I32 },
      { name: "I64", value: ManifestSborValue.I64 },
      { name: "I128", value: ManifestSborValue.I128 },
      { name: "String", value: ManifestSborValue.String },
      { name: "Enum", value: ManifestSborValue.Enum },
      { name: "Array", value: ManifestSborValue.Array },
      { name: "Map", value: ManifestSborValue.Map },
      { name: "Tuple", value: ManifestSborValue.Tuple },
      { name: "Address", value: ManifestSborValue.Address },
      { name: "Bucket", value: ManifestSborValue.Bucket },
      { name: "Proof", value: ManifestSborValue.Proof },
      { name: "Decimal", value: ManifestSborValue.Decimal },
      { name: "PreciseDecimal", value: ManifestSborValue.PreciseDecimal },
      {
        name: "NonFungibleLocalId",
        value: ManifestSborValue.NonFungibleLocalId,
      },
      { name: "Expression", value: ManifestSborValue.Expression },
      { name: "Blob", value: ManifestSborValue.Blob },
      { name: "Bytes", value: ManifestSborValue.Bytes },
    ],
  },
};

const scryptoSborValueTypeOptions: TypeOptions = {
  discriminator: {
    property: "kind",
    subTypes: [
      { name: "Bool", value: ScryptoSborValue.Bool },
      { name: "U8", value: ScryptoSborValue.U8 },
      { name: "U16", value: ScryptoSborValue.U16 },
      { name: "U32", value: ScryptoSborValue.U32 },
      { name: "U64", value: ScryptoSborValue.U64 },
      { name: "U128", value: ScryptoSborValue.U128 },
      { name: "I8", value: ScryptoSborValue.I8 },
      { name: "I16", value: ScryptoSborValue.I16 },
      { name: "I32", value: ScryptoSborValue.I32 },
      { name: "I64", value: ScryptoSborValue.I64 },
      { name: "I128", value: ScryptoSborValue.I128 },
      { name: "String", value: ScryptoSborValue.String },
      { name: "Enum", value: ScryptoSborValue.Enum },
      { name: "Array", value: ScryptoSborValue.Array },
      { name: "Map", value: ScryptoSborValue.Map },
      { name: "Tuple", value: ScryptoSborValue.Tuple },
      { name: "Address", value: ScryptoSborValue.Address },
      { name: "Own", value: ScryptoSborValue.Own },
      { name: "Decimal", value: ScryptoSborValue.Decimal },
      { name: "PreciseDecimal", value: ScryptoSborValue.PreciseDecimal },
      {
        name: "NonFungibleLocalId",
        value: ScryptoSborValue.NonFungibleLocalId,
      },
      { name: "Reference", value: ScryptoSborValue.Reference },
      { name: "Bytes", value: ScryptoSborValue.Bytes },
    ],
  },
};

export class Value {
  readonly type: "ScryptoSbor" | "ManifestSbor";

  constructor(type: "ScryptoSbor" | "ManifestSbor") {
    this.type = type;
  }
}

export class ScryptoSbor extends Value {
  @Expose()
  @Type(() => ScryptoSborValue.Value, scryptoSborValueTypeOptions)
  value: ScryptoSborValue.Value;

  constructor(value: ScryptoSborValue.Value) {
    super("ScryptoSbor");
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }

  toSborValue(): ScryptoSbor | ManifestSbor {
    return this;
  }
}

export class ManifestSbor extends Value {
  @Expose()
  @Type(() => ManifestSborValue.Value, manifestSborValueTypeOptions)
  value: ManifestSborValue.Value;

  @Expose({ name: "manifest_string" })
  @Type(() => String)
  manifestString: string;

  constructor(value: ManifestSborValue.Value, manifestString: string) {
    super("ManifestSbor");
    this.value = value;
    this.manifestString = manifestString;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }

  toSborValue(): ScryptoSbor | ManifestSbor {
    return this;
  }
}
