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

import { describe, expect, test } from "vitest";
import { Convert, ManifestSborValue } from "../../src";
import { deserialize, serialize } from "../../src/utils";
import { assertSerializationEquals } from "../test_utils";

const Kind = ManifestSborValue.Kind;
const Bool = ManifestSborValue.Bool;
const U8 = ManifestSborValue.U8;
const U16 = ManifestSborValue.U16;
const U32 = ManifestSborValue.U32;
const U64 = ManifestSborValue.U64;
const U128 = ManifestSborValue.U128;
const I8 = ManifestSborValue.I8;
const I16 = ManifestSborValue.I16;
const I32 = ManifestSborValue.I32;
const I64 = ManifestSborValue.I64;
const I128 = ManifestSborValue.I128;
const String = ManifestSborValue.String;
const Enum = ManifestSborValue.Enum;
const Array = ManifestSborValue.Array;
const Map = ManifestSborValue.Map;
const Tuple = ManifestSborValue.Tuple;
const Address = ManifestSborValue.Address;
const Bucket = ManifestSborValue.Bucket;
const Proof = ManifestSborValue.Proof;
const Decimal = ManifestSborValue.Decimal;
const PreciseDecimal = ManifestSborValue.PreciseDecimal;
const NonFungibleLocalId = ManifestSborValue.NonFungibleLocalId;
const Expression = ManifestSborValue.Expression;
const Blob = ManifestSborValue.Blob;
const Bytes = ManifestSborValue.Bytes;

describe.each([
  {
    expectedObject: new Bool(true),
    expectedSerialization: `{"kind":"Bool","value":true}`,
  },
  {
    expectedObject: new Bool(false),
    expectedSerialization: `{"kind":"Bool","value":false}`,
  },
  {
    expectedObject: new U8(1),
    expectedSerialization: `{"kind":"U8","value":"1"}`,
  },
  {
    expectedObject: new U16(1),
    expectedSerialization: `{"kind":"U16","value":"1"}`,
  },
  {
    expectedObject: new U32(1),
    expectedSerialization: `{"kind":"U32","value":"1"}`,
  },
  {
    expectedObject: new U64(BigInt(1)),
    expectedSerialization: `{"kind":"U64","value":"1"}`,
  },
  {
    expectedObject: new U128(BigInt(1)),
    expectedSerialization: `{"kind":"U128","value":"1"}`,
  },
  {
    expectedObject: new I8(1),
    expectedSerialization: `{"kind":"I8","value":"1"}`,
  },
  {
    expectedObject: new I16(1),
    expectedSerialization: `{"kind":"I16","value":"1"}`,
  },
  {
    expectedObject: new I32(1),
    expectedSerialization: `{"kind":"I32","value":"1"}`,
  },
  {
    expectedObject: new I64(BigInt(1)),
    expectedSerialization: `{"kind":"I64","value":"1"}`,
  },
  {
    expectedObject: new I128(BigInt(1)),
    expectedSerialization: `{"kind":"I128","value":"1"}`,
  },
  {
    expectedObject: new String("Scrypto"),
    expectedSerialization: `{"kind":"String","value":"Scrypto"}`,
  },
  {
    expectedObject: new Enum(1),
    expectedSerialization: `{"kind":"Enum","variant_id":"1","fields":[]}`,
  },
  {
    expectedObject: new Enum(1, [new U8(1)]),
    expectedSerialization: `{"kind":"Enum","variant_id":"1","fields":[{"kind":"U8","value":"1"}]}`,
  },
  {
    expectedObject: new Array(Kind.U8, [new U8(1), new U8(2), new U8(3)]),
    expectedSerialization: `{"kind":"Array","element_kind":"U8","elements":[{"kind":"U8","value":"1"},{"kind":"U8","value":"2"},{"kind":"U8","value":"3"}]}`,
  },
  {
    expectedObject: new Map(Kind.U8, Kind.String, [
      { key: new U8(65), value: new String("A") },
      { key: new U8(66), value: new String("B") },
    ]),
    expectedSerialization: `{"kind":"Map","key_kind":"U8","value_kind":"String","entries":[{"key":{"kind":"U8","value":"65"},"value":{"kind":"String","value":"A"}},{"key":{"kind":"U8","value":"66"},"value":{"kind":"String","value":"B"}}]}`,
  },
  {
    expectedObject: new Tuple([
      new Tuple([new U8(1), new String("Something")]),
    ]),
    expectedSerialization: `{"kind":"Tuple","fields":[{"kind":"Tuple","fields":[{"kind":"U8","value":"1"},{"kind":"String","value":"Something"}]}]}`,
  },
  {
    expectedObject: new Decimal(1),
    expectedSerialization: `{"kind":"Decimal","value":"1"}`,
  },
  {
    expectedObject: new PreciseDecimal(1),
    expectedSerialization: `{"kind":"PreciseDecimal","value":"1"}`,
  },
  {
    expectedObject: new Bytes(
      Convert.HexString.toUint8Array(
        "d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"
      )
    ),
    expectedSerialization: `{"kind":"Bytes","element_kind":"U8","hex":"d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"}`,
  },
  {
    expectedObject: new Blob(
      Convert.HexString.toUint8Array(
        "d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"
      )
    ),
    expectedSerialization: `{"kind":"Blob","value":"d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"}`,
  },
  {
    expectedObject: new Address(
      "clock_rdx1skxxxxxxxxxxclckxxxxxxxxxxx002253583992xxxxxxxxxclckxx"
    ),
    expectedSerialization: `{"kind":"Address","value":"clock_rdx1skxxxxxxxxxxclckxxxxxxxxxxx002253583992xxxxxxxxxclckxx"}`,
  },
  {
    expectedObject: new Bucket(1),
    expectedSerialization: `{"kind":"Bucket","value":"1"}`,
  },
  {
    expectedObject: new Proof(1),
    expectedSerialization: `{"kind":"Proof","value":"1"}`,
  },
  {
    expectedObject: new NonFungibleLocalId(
      "{b55081fa-9cd1-48c2-95d4-efe2db322a54}"
    ),
    expectedSerialization: `{"kind":"NonFungibleLocalId","value":"{b55081fa-9cd1-48c2-95d4-efe2db322a54}"}`,
  },
  {
    expectedObject: Expression.entireAuthZone(),
    expectedSerialization: `{"kind":"Expression","value":"ENTIRE_AUTH_ZONE"}`,
  },
])(
  "Serialization test for $expectedSerialization",
  ({ expectedObject, expectedSerialization }) => {
    test(`${expectedObject} is serialized as expected`, () => {
      // Act
      let actualSerialization = serialize(expectedObject);

      // Assert
      assertSerializationEquals(actualSerialization, expectedSerialization);
    });

    test(`${expectedSerialization} is deserialized as expected`, () => {
      // Act
      let actualObject = deserialize(
        expectedSerialization,
        // @ts-ignore
        expectedObject.constructor
      );

      // Assert
      expect(actualObject).toEqual(expectedObject);
    });
  }
);
