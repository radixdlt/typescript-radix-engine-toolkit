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

import { ScryptoSborValue } from "../../src";
import { describe, expect, test } from "vitest";
import { deserialize, serialize } from "../../src/utils";

describe.each([
  {
    expectedObject: new ScryptoSborValue.Bool(true),
    expectedSerialization: `{"type":"Bool","value":true}`,
  },
  {
    expectedObject: new ScryptoSborValue.Bool(false),
    expectedSerialization: `{"type":"Bool","value":false}`,
  },
  {
    expectedObject: new ScryptoSborValue.U8(1),
    expectedSerialization: `{"type":"U8","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.U16(1),
    expectedSerialization: `{"type":"U16","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.U32(1),
    expectedSerialization: `{"type":"U32","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.U64(1),
    expectedSerialization: `{"type":"U64","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.U128(BigInt("1")),
    expectedSerialization: `{"type":"U128","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.I8(1),
    expectedSerialization: `{"type":"I8","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.I16(1),
    expectedSerialization: `{"type":"I16","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.I32(1),
    expectedSerialization: `{"type":"I32","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.I64(1),
    expectedSerialization: `{"type":"I64","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.I128(BigInt("1")),
    expectedSerialization: `{"type":"I128","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.String("Scrypto"),
    expectedSerialization: `{"type":"String","value":"Scrypto"}`,
  },
  {
    expectedObject: new ScryptoSborValue.Enum(1),
    expectedSerialization: `{"type":"Enum","variant":"1","fields":[]}`,
  },
  {
    expectedObject: new ScryptoSborValue.Enum(1, [new ScryptoSborValue.U8(1)]),
    expectedSerialization: `{"type":"Enum","variant":"1","fields":[{"type":"U8","value":"1"}]}`,
  },
  {
    expectedObject: new ScryptoSborValue.Array(ScryptoSborValue.Kind.U8, [
      new ScryptoSborValue.U8(1),
      new ScryptoSborValue.U8(2),
      new ScryptoSborValue.U8(3),
    ]),
    expectedSerialization: `{"type":"Array","element_kind":"U8","elements":[{"type":"U8","value":"1"},{"type":"U8","value":"2"},{"type":"U8","value":"3"}]}`,
  },
  {
    expectedObject: new ScryptoSborValue.Map(
      ScryptoSborValue.Kind.U8,
      ScryptoSborValue.Kind.String,
      [
        [new ScryptoSborValue.U8(65), new ScryptoSborValue.String("A")],
        [new ScryptoSborValue.U8(66), new ScryptoSborValue.String("B")],
      ]
    ),
    expectedSerialization: `{"type":"Map","key_value_kind":"U8","value_value_kind":"String","entries":[[{"type":"U8","value":"65"},{"type":"String","value":"A"}],[{"type":"U8","value":"66"},{"type":"String","value":"B"}]]}`,
  },
  {
    expectedObject: new ScryptoSborValue.Map(
      ScryptoSborValue.Kind.U8,
      ScryptoSborValue.Kind.String,
      [
        [new ScryptoSborValue.U8(65), new ScryptoSborValue.String("A")],
        [new ScryptoSborValue.U8(66), new ScryptoSborValue.String("B")],
      ]
    ),
    expectedSerialization: `{"type":"Map","key_value_kind":"U8","value_value_kind":"String","entries":[[{"type":"U8","value":"65"},{"type":"String","value":"A"}],[{"type":"U8","value":"66"},{"type":"String","value":"B"}]]}`,
  },
  {
    expectedObject: new ScryptoSborValue.Tuple([
      new ScryptoSborValue.Tuple([
        new ScryptoSborValue.U8(1),
        new ScryptoSborValue.String("Something"),
      ]),
    ]),
    expectedSerialization: `{"type":"Tuple","elements":[{"type":"Tuple","elements":[{"type":"U8","value":"1"},{"type":"String","value":"Something"}]}]}`,
  },
  {
    expectedObject: new ScryptoSborValue.Decimal(BigInt("1")),
    expectedSerialization: `{"type":"Decimal","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.PreciseDecimal(BigInt("1")),
    expectedSerialization: `{"type":"PreciseDecimal","value":"1"}`,
  },
  {
    expectedObject: new ScryptoSborValue.Address(
      "component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"
    ),
    expectedSerialization: `{"type":"Address","address":"component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"}`,
  },
  {
    expectedObject: new ScryptoSborValue.Address(
      "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
    ),
    expectedSerialization: `{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"}`,
  },
  {
    expectedObject: new ScryptoSborValue.Address(
      "package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"
    ),
    expectedSerialization: `{"type":"Address","address":"package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"}`,
  },

  {
    expectedObject: new ScryptoSborValue.Own(
      new ScryptoSborValue.Bucket(
        new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
        ])
      )
    ),
    expectedSerialization: `{"type":"Own","value":{"type":"Bucket","value":"00000000000000000000000000000000000000000000000000000000000000"}}`,
  },
  {
    expectedObject: new ScryptoSborValue.Own(
      new ScryptoSborValue.Proof(
        new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
        ])
      )
    ),
    expectedSerialization: `{"type":"Own","value":{"type":"Proof","value":"00000000000000000000000000000000000000000000000000000000000000"}}`,
  },
  {
    expectedObject: new ScryptoSborValue.Own(
      new ScryptoSborValue.Vault(
        new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
        ])
      )
    ),
    expectedSerialization: `{"type":"Own","value":{"type":"Vault","value":"00000000000000000000000000000000000000000000000000000000000000"}}`,
  },
  {
    expectedObject: new ScryptoSborValue.Own(
      new ScryptoSborValue.ObjectNode(
        new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
        ])
      )
    ),
    expectedSerialization: `{"type":"Own","value":{"type":"Object","value":"00000000000000000000000000000000000000000000000000000000000000"}}`,
  },
  {
    expectedObject: new ScryptoSborValue.Own(
      new ScryptoSborValue.KeyValueStore(
        new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
        ])
      )
    ),
    expectedSerialization: `{"type":"Own","value":{"type":"KeyValueStore","value":"00000000000000000000000000000000000000000000000000000000000000"}}`,
  },
  {
    expectedObject: new ScryptoSborValue.NonFungibleLocalId(
      new ScryptoSborValue.UUID(
        BigInt("241008287272164729465721528295504357972")
      )
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"UUID","value":"241008287272164729465721528295504357972"}}`,
  },
  {
    expectedObject: new ScryptoSborValue.NonFungibleLocalId(
      new ScryptoSborValue.Integer(1)
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"Integer","value":"1"}}`,
  },
  {
    expectedObject: new ScryptoSborValue.NonFungibleLocalId(
      new ScryptoSborValue.String("Scrypto")
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"String","value":"Scrypto"}}`,
  },
  {
    expectedObject: new ScryptoSborValue.NonFungibleLocalId(
      new ScryptoSborValue.Bytes(new Uint8Array([0x01, 0x02, 0x03, 0x04]))
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"Bytes","value":"01020304"}}`,
  },
  {
    expectedObject: new ScryptoSborValue.Bytes(
      new Uint8Array([
        210, 141, 44, 55, 16, 96, 31, 188, 9, 112, 0, 236, 115, 69, 86, 147,
        244, 134, 29, 192, 235, 124, 144, 216, 130, 31, 42, 19, 246, 23, 49, 62,
      ])
    ),
    expectedSerialization: `{"type":"Bytes","value":"d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"}`,
  },
  {
    expectedObject: new ScryptoSborValue.Reference(
      new Uint8Array([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
      ])
    ),
    expectedSerialization: `{"type":"Reference","value":"00000000000000000000000000000000000000000000000000000000000000"}`,
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
