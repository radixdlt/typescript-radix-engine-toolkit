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
import { ManifestAddress } from "../index";

export type Value =
  | {
      kind: ValueKind.Bool;
      value: boolean;
    }
  | {
      kind: ValueKind.I8;
      value: number;
    }
  | {
      kind: ValueKind.I16;
      value: number;
    }
  | {
      kind: ValueKind.I32;
      value: number;
    }
  | {
      kind: ValueKind.I64;
      value: bigint;
    }
  | {
      kind: ValueKind.I128;
      value: bigint;
    }
  | {
      kind: ValueKind.U8;
      value: number;
    }
  | {
      kind: ValueKind.U16;
      value: number;
    }
  | {
      kind: ValueKind.U32;
      value: number;
    }
  | {
      kind: ValueKind.U64;
      value: bigint;
    }
  | {
      kind: ValueKind.U128;
      value: bigint;
    }
  | {
      kind: ValueKind.String;
      value: string;
    }
  | {
      kind: ValueKind.Enum;
      discriminator: number;
      fields: Value[];
    }
  | {
      kind: ValueKind.Array;
      elementValueKind: ValueKind;
      elements: Value[];
    }
  | {
      kind: ValueKind.Tuple;
      fields: Value[];
    }
  | {
      kind: ValueKind.Map;
      keyValueKind: ValueKind;
      valueValueKind: ValueKind;
      entries: MapEntry[];
    }
  | {
      kind: ValueKind.Address;
      value: ManifestAddress;
    }
  | {
      kind: ValueKind.Bucket;
      value: number;
    }
  | {
      kind: ValueKind.Proof;
      value: number;
    }
  | {
      kind: ValueKind.Expression;
      value: Expression;
    }
  | {
      kind: ValueKind.Blob;
      value: Uint8Array;
    }
  | {
      kind: ValueKind.Decimal;
      value: Decimal;
    }
  | {
      kind: ValueKind.PreciseDecimal;
      value: Decimal;
    }
  | {
      kind: ValueKind.NonFungibleLocalId;
      value: string;
    }
  | {
      kind: ValueKind.AddressReservation;
      value: number;
    };

export enum ValueKind {
  Bool = "Bool",
  I8 = "I8",
  I16 = "I16",
  I32 = "I32",
  I64 = "I64",
  I128 = "I128",
  U8 = "U8",
  U16 = "U16",
  U32 = "U32",
  U64 = "U64",
  U128 = "U128",
  String = "String",
  Enum = "Enum",
  Array = "Array",
  Tuple = "Tuple",
  Map = "Map",
  Address = "Address",
  Bucket = "Bucket",
  Proof = "Proof",
  Expression = "Expression",
  Blob = "Blob",
  Decimal = "Decimal",
  PreciseDecimal = "PreciseDecimal",
  NonFungibleLocalId = "NonFungibleLocalId",
  AddressReservation = "AddressReservation",
}

export interface MapEntry {
  key: Value;
  value: Value;
}

export enum Expression {
  EntireWorktop = "EntireWorktop",
  EntireAuthZone = "EntireAuthZone",
}
