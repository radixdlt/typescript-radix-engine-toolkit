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

import { ManifestSborValue } from "../../src";
import { describe, expect, test } from "vitest";
import { deserialize, serialize } from "../../src/utils";

describe.each([
  {
    expectedObject: new ManifestSborValue.Bool(true),
    expectedSerialization: `{"type":"Bool","value":true}`,
  },
  {
    expectedObject: new ManifestSborValue.Bool(false),
    expectedSerialization: `{"type":"Bool","value":false}`,
  },
  {
    expectedObject: new ManifestSborValue.U8(1),
    expectedSerialization: `{"type":"U8","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.U16(1),
    expectedSerialization: `{"type":"U16","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.U32(1),
    expectedSerialization: `{"type":"U32","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.U64(1),
    expectedSerialization: `{"type":"U64","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.U128(BigInt("1")),
    expectedSerialization: `{"type":"U128","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.I8(1),
    expectedSerialization: `{"type":"I8","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.I16(1),
    expectedSerialization: `{"type":"I16","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.I32(1),
    expectedSerialization: `{"type":"I32","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.I64(1),
    expectedSerialization: `{"type":"I64","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.I128(BigInt("1")),
    expectedSerialization: `{"type":"I128","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.String("Scrypto"),
    expectedSerialization: `{"type":"String","value":"Scrypto"}`,
  },
  {
    expectedObject: new ManifestSborValue.Enum(1),
    expectedSerialization: `{"type":"Enum","variant":"1","fields":[]}`,
  },
  {
    expectedObject: new ManifestSborValue.Enum(1, [
      new ManifestSborValue.U8(1),
    ]),
    expectedSerialization: `{"type":"Enum","variant":"1","fields":[{"type":"U8","value":"1"}]}`,
  },
  {
    expectedObject: new ManifestSborValue.Array(ManifestSborValue.Kind.U8, [
      new ManifestSborValue.U8(1),
      new ManifestSborValue.U8(2),
      new ManifestSborValue.U8(3),
    ]),
    expectedSerialization: `{"type":"Array","element_kind":"U8","elements":[{"type":"U8","value":"1"},{"type":"U8","value":"2"},{"type":"U8","value":"3"}]}`,
  },
  {
    expectedObject: new ManifestSborValue.Map(
      ManifestSborValue.Kind.U8,
      ManifestSborValue.Kind.String,
      [
        [new ManifestSborValue.U8(65), new ManifestSborValue.String("A")],
        [new ManifestSborValue.U8(66), new ManifestSborValue.String("B")],
      ]
    ),
    expectedSerialization: `{"type":"Map","key_value_kind":"U8","value_value_kind":"String","entries":[[{"type":"U8","value":"65"},{"type":"String","value":"A"}],[{"type":"U8","value":"66"},{"type":"String","value":"B"}]]}`,
  },
  {
    expectedObject: new ManifestSborValue.Map(
      ManifestSborValue.Kind.U8,
      ManifestSborValue.Kind.String,
      [
        [new ManifestSborValue.U8(65), new ManifestSborValue.String("A")],
        [new ManifestSborValue.U8(66), new ManifestSborValue.String("B")],
      ]
    ),
    expectedSerialization: `{"type":"Map","key_value_kind":"U8","value_value_kind":"String","entries":[[{"type":"U8","value":"65"},{"type":"String","value":"A"}],[{"type":"U8","value":"66"},{"type":"String","value":"B"}]]}`,
  },
  {
    expectedObject: new ManifestSborValue.Tuple([
      new ManifestSborValue.Tuple([
        new ManifestSborValue.U8(1),
        new ManifestSborValue.String("Something"),
      ]),
    ]),
    expectedSerialization: `{"type":"Tuple","elements":[{"type":"Tuple","elements":[{"type":"U8","value":"1"},{"type":"String","value":"Something"}]}]}`,
  },
  {
    expectedObject: new ManifestSborValue.Decimal(BigInt("1")),
    expectedSerialization: `{"type":"Decimal","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.PreciseDecimal(BigInt("1")),
    expectedSerialization: `{"type":"PreciseDecimal","value":"1"}`,
  },
  {
    expectedObject: new ManifestSborValue.Address(
      "component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"
    ),
    expectedSerialization: `{"type":"Address","address":"component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"}`,
  },
  {
    expectedObject: new ManifestSborValue.Address(
      "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
    ),
    expectedSerialization: `{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"}`,
  },
  {
    expectedObject: new ManifestSborValue.Address(
      "package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"
    ),
    expectedSerialization: `{"type":"Address","address":"package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"}`,
  },
  {
    expectedObject: new ManifestSborValue.Bucket(
      new ManifestSborValue.String("bucket")
    ),
    expectedSerialization: `{"type":"Bucket","identifier":{"type":"String","value":"bucket"}}`,
  },
  {
    expectedObject: new ManifestSborValue.Bucket(new ManifestSborValue.U32(1)),
    expectedSerialization: `{"type":"Bucket","identifier":{"type":"U32","value":"1"}}`,
  },
  {
    expectedObject: new ManifestSborValue.Proof(
      new ManifestSborValue.String("proof")
    ),
    expectedSerialization: `{"type":"Proof","identifier":{"type":"String","value":"proof"}}`,
  },
  {
    expectedObject: new ManifestSborValue.Proof(new ManifestSborValue.U32(1)),
    expectedSerialization: `{"type":"Proof","identifier":{"type":"U32","value":"1"}}`,
  },
  {
    expectedObject: new ManifestSborValue.NonFungibleLocalId(
      new ManifestSborValue.UUID(
        BigInt("241008287272164729465721528295504357972")
      )
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"UUID","value":"241008287272164729465721528295504357972"}}`,
  },
  {
    expectedObject: new ManifestSborValue.NonFungibleLocalId(
      new ManifestSborValue.Integer(1)
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"Integer","value":"1"}}`,
  },
  {
    expectedObject: new ManifestSborValue.NonFungibleLocalId(
      new ManifestSborValue.String("Scrypto")
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"String","value":"Scrypto"}}`,
  },
  {
    expectedObject: new ManifestSborValue.NonFungibleLocalId(
      new ManifestSborValue.Bytes(new Uint8Array([0x01, 0x02, 0x03, 0x04]))
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"Bytes","value":"01020304"}}`,
  },
  {
    expectedObject: ManifestSborValue.Expression.entireWorktop(),
    expectedSerialization: `{"type":"Expression","value":"ENTIRE_WORKTOP"}`,
  },
  {
    expectedObject: ManifestSborValue.Expression.entireAuthZone(),
    expectedSerialization: `{"type":"Expression","value":"ENTIRE_AUTH_ZONE"}`,
  },
  {
    expectedObject: new ManifestSborValue.Blob(
      new Uint8Array([
        210, 141, 44, 55, 16, 96, 31, 188, 9, 112, 0, 236, 115, 69, 86, 147,
        244, 134, 29, 192, 235, 124, 144, 216, 130, 31, 42, 19, 246, 23, 49, 62,
      ])
    ),
    expectedSerialization: `{"type":"Blob","hash":"d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"}`,
  },
  {
    expectedObject: new ManifestSborValue.Bytes(
      new Uint8Array([
        210, 141, 44, 55, 16, 96, 31, 188, 9, 112, 0, 236, 115, 69, 86, 147,
        244, 134, 29, 192, 235, 124, 144, 216, 130, 31, 42, 19, 246, 23, 49, 62,
      ])
    ),
    expectedSerialization: `{"type":"Bytes","value":"d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"}`,
  },
])(
  "Serialization test for $expectedSerialization",
  ({ expectedObject, expectedSerialization }) => {
    test(`${expectedObject} is serialized as expected`, () => {
      // Act
      let actualSerialization = serialize(expectedObject);

      // Assert
      expect(actualSerialization).toEqual(expectedSerialization);
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
