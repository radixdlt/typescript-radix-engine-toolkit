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
import { ManifestAstValue } from "../../src";
import { deserialize, serialize } from "../../src/utils";
import { assertSerializationEquals } from "../test_utils";

describe.each([
  {
    expectedObject: new ManifestAstValue.Bool(true),
    expectedSerialization: `{"type":"Bool","value":true}`,
  },
  {
    expectedObject: new ManifestAstValue.Bool(false),
    expectedSerialization: `{"type":"Bool","value":false}`,
  },
  {
    expectedObject: new ManifestAstValue.U8(1),
    expectedSerialization: `{"type":"U8","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.U16(1),
    expectedSerialization: `{"type":"U16","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.U32(1),
    expectedSerialization: `{"type":"U32","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.U64(1),
    expectedSerialization: `{"type":"U64","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.U128(BigInt("1")),
    expectedSerialization: `{"type":"U128","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.I8(1),
    expectedSerialization: `{"type":"I8","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.I16(1),
    expectedSerialization: `{"type":"I16","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.I32(1),
    expectedSerialization: `{"type":"I32","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.I64(1),
    expectedSerialization: `{"type":"I64","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.I128(BigInt("1")),
    expectedSerialization: `{"type":"I128","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.String("Scrypto"),
    expectedSerialization: `{"type":"String","value":"Scrypto"}`,
  },
  {
    expectedObject: new ManifestAstValue.Enum(
      new ManifestAstValue.EnumU8Discriminator(1)
    ),
    expectedSerialization: `{"type":"Enum","variant":{"type":"U8","discriminator":"1"},"fields":[]}`,
  },
  {
    expectedObject: new ManifestAstValue.Enum(
      new ManifestAstValue.EnumStringDiscriminator("EnumName::Variant")
    ),
    expectedSerialization: `{"type":"Enum","variant":{"type":"String","discriminator":"EnumName::Variant"},"fields":[]}`,
  },
  {
    expectedObject: new ManifestAstValue.Enum(
      new ManifestAstValue.EnumU8Discriminator(1),
      [new ManifestAstValue.U8(1)]
    ),
    expectedSerialization: `{"type":"Enum","variant":{"type":"U8","discriminator":"1"},"fields":[{"type":"U8","value":"1"}]}`,
  },
  {
    expectedObject: new ManifestAstValue.Enum(
      new ManifestAstValue.EnumStringDiscriminator("EnumName::Variant"),
      [new ManifestAstValue.U8(1)]
    ),
    expectedSerialization: `{"type":"Enum","variant":{"type":"String","discriminator":"EnumName::Variant"},"fields":[{"type":"U8","value":"1"}]}`,
  },
  {
    expectedObject: new ManifestAstValue.Some(new ManifestAstValue.U8(1)),
    expectedSerialization: `{"type":"Some","value":{"type":"U8","value":"1"}}`,
  },
  {
    expectedObject: new ManifestAstValue.None(),
    expectedSerialization: `{"type":"None"}`,
  },
  {
    expectedObject: new ManifestAstValue.Ok(new ManifestAstValue.U8(1)),
    expectedSerialization: `{"type":"Ok","value":{"type":"U8","value":"1"}}`,
  },
  {
    expectedObject: new ManifestAstValue.Err(new ManifestAstValue.U8(1)),
    expectedSerialization: `{"type":"Err","value":{"type":"U8","value":"1"}}`,
  },
  {
    expectedObject: new ManifestAstValue.Err(new ManifestAstValue.U8(1)),
    expectedSerialization: `{"type":"Err","value":{"type":"U8","value":"1"}}`,
  },
  {
    expectedObject: new ManifestAstValue.Array(ManifestAstValue.Kind.U8, [
      new ManifestAstValue.U8(1),
      new ManifestAstValue.U8(2),
      new ManifestAstValue.U8(3),
    ]),
    expectedSerialization: `{"type":"Array","element_kind":"U8","elements":[{"type":"U8","value":"1"},{"type":"U8","value":"2"},{"type":"U8","value":"3"}]}`,
  },
  {
    expectedObject: new ManifestAstValue.Map(
      ManifestAstValue.Kind.U8,
      ManifestAstValue.Kind.String,
      [
        [new ManifestAstValue.U8(65), new ManifestAstValue.String("A")],
        [new ManifestAstValue.U8(66), new ManifestAstValue.String("B")],
      ]
    ),
    expectedSerialization: `{"type":"Map","key_value_kind":"U8","value_value_kind":"String","entries":[[{"type":"U8","value":"65"},{"type":"String","value":"A"}],[{"type":"U8","value":"66"},{"type":"String","value":"B"}]]}`,
  },
  {
    expectedObject: new ManifestAstValue.Map(
      ManifestAstValue.Kind.U8,
      ManifestAstValue.Kind.String,
      [
        [new ManifestAstValue.U8(65), new ManifestAstValue.String("A")],
        [new ManifestAstValue.U8(66), new ManifestAstValue.String("B")],
      ]
    ),
    expectedSerialization: `{"type":"Map","key_value_kind":"U8","value_value_kind":"String","entries":[[{"type":"U8","value":"65"},{"type":"String","value":"A"}],[{"type":"U8","value":"66"},{"type":"String","value":"B"}]]}`,
  },
  {
    expectedObject: new ManifestAstValue.Tuple([
      new ManifestAstValue.Tuple([
        new ManifestAstValue.U8(1),
        new ManifestAstValue.String("Something"),
      ]),
    ]),
    expectedSerialization: `{"type":"Tuple","elements":[{"type":"Tuple","elements":[{"type":"U8","value":"1"},{"type":"String","value":"Something"}]}]}`,
  },
  {
    expectedObject: new ManifestAstValue.Decimal(BigInt("1")),
    expectedSerialization: `{"type":"Decimal","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.PreciseDecimal(BigInt("1")),
    expectedSerialization: `{"type":"PreciseDecimal","value":"1"}`,
  },
  {
    expectedObject: new ManifestAstValue.Address(
      "component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"
    ),
    expectedSerialization: `{"type":"Address","address":"component_rdx1qtkryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsrdcazt"}`,
  },
  {
    expectedObject: new ManifestAstValue.Address(
      "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"
    ),
    expectedSerialization: `{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy99qqm"}`,
  },
  {
    expectedObject: new ManifestAstValue.Address(
      "package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"
    ),
    expectedSerialization: `{"type":"Address","address":"package_rdx1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqzrhqe8"}`,
  },
  {
    expectedObject: new ManifestAstValue.Bucket(
      new ManifestAstValue.String("bucket")
    ),
    expectedSerialization: `{"type":"Bucket","identifier":{"type":"String","value":"bucket"}}`,
  },
  {
    expectedObject: new ManifestAstValue.Bucket(new ManifestAstValue.U32(1)),
    expectedSerialization: `{"type":"Bucket","identifier":{"type":"U32","value":"1"}}`,
  },
  {
    expectedObject: new ManifestAstValue.Proof(
      new ManifestAstValue.String("proof")
    ),
    expectedSerialization: `{"type":"Proof","identifier":{"type":"String","value":"proof"}}`,
  },
  {
    expectedObject: new ManifestAstValue.Proof(new ManifestAstValue.U32(1)),
    expectedSerialization: `{"type":"Proof","identifier":{"type":"U32","value":"1"}}`,
  },
  {
    expectedObject: new ManifestAstValue.NonFungibleLocalId(
      new ManifestAstValue.UUID(
        BigInt("241008287272164729465721528295504357972")
      )
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"UUID","value":"241008287272164729465721528295504357972"}}`,
  },
  {
    expectedObject: new ManifestAstValue.NonFungibleLocalId(
      new ManifestAstValue.Integer(1)
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"Integer","value":"1"}}`,
  },
  {
    expectedObject: new ManifestAstValue.NonFungibleLocalId(
      new ManifestAstValue.String("Scrypto")
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"String","value":"Scrypto"}}`,
  },
  {
    expectedObject: new ManifestAstValue.NonFungibleLocalId(
      new ManifestAstValue.Bytes(new Uint8Array([0x01, 0x02, 0x03, 0x04]))
    ),
    expectedSerialization: `{"type":"NonFungibleLocalId","value":{"type":"Bytes","value":"01020304"}}`,
  },

  {
    expectedObject: new ManifestAstValue.NonFungibleGlobalId(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs3ydc4g"
      ),
      new ManifestAstValue.NonFungibleLocalId(
        new ManifestAstValue.UUID(
          BigInt("241008287272164729465721528295504357972")
        )
      )
    ),
    expectedSerialization: `{"type":"NonFungibleGlobalId","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs3ydc4g"},"non_fungible_local_id":{"type":"NonFungibleLocalId","value":{"type":"UUID","value":"241008287272164729465721528295504357972"}}}`,
  },
  {
    expectedObject: new ManifestAstValue.NonFungibleGlobalId(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs3ydc4g"
      ),
      new ManifestAstValue.NonFungibleLocalId(new ManifestAstValue.Integer(1))
    ),
    expectedSerialization: `{"type":"NonFungibleGlobalId","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs3ydc4g"},"non_fungible_local_id":{"type":"NonFungibleLocalId","value":{"type":"Integer","value":"1"}}}`,
  },
  {
    expectedObject: new ManifestAstValue.NonFungibleGlobalId(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs3ydc4g"
      ),
      new ManifestAstValue.NonFungibleLocalId(
        new ManifestAstValue.String("Scrypto")
      )
    ),
    expectedSerialization: `{"type":"NonFungibleGlobalId","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs3ydc4g"},"non_fungible_local_id":{"type":"NonFungibleLocalId","value":{"type":"String","value":"Scrypto"}}}`,
  },
  {
    expectedObject: new ManifestAstValue.NonFungibleGlobalId(
      new ManifestAstValue.Address(
        "resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs3ydc4g"
      ),
      new ManifestAstValue.NonFungibleLocalId(
        new ManifestAstValue.Bytes(new Uint8Array([0x01, 0x02, 0x03, 0x04]))
      )
    ),
    expectedSerialization: `{"type":"NonFungibleGlobalId","resource_address":{"type":"Address","address":"resource_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs3ydc4g"},"non_fungible_local_id":{"type":"NonFungibleLocalId","value":{"type":"Bytes","value":"01020304"}}}`,
  },
  {
    expectedObject: ManifestAstValue.Expression.entireWorktop(),
    expectedSerialization: `{"type":"Expression","value":"ENTIRE_WORKTOP"}`,
  },
  {
    expectedObject: ManifestAstValue.Expression.entireAuthZone(),
    expectedSerialization: `{"type":"Expression","value":"ENTIRE_AUTH_ZONE"}`,
  },
  {
    expectedObject: new ManifestAstValue.Blob(
      new Uint8Array([
        210, 141, 44, 55, 16, 96, 31, 188, 9, 112, 0, 236, 115, 69, 86, 147,
        244, 134, 29, 192, 235, 124, 144, 216, 130, 31, 42, 19, 246, 23, 49, 62,
      ])
    ),
    expectedSerialization: `{"type":"Blob","hash":"d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"}`,
  },
  {
    expectedObject: new ManifestAstValue.Bytes(
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
