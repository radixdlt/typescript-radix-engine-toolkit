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
import {
  EnumStringDiscriminator,
  EnumU8Discriminator,
} from "../../src/models/value/manifest_ast";
import { deserialize, serialize } from "../../src/utils";
import { assertSerializationEquals } from "../test_utils";

const Kind = ManifestAstValue.Kind;
const Bool = ManifestAstValue.Bool;
const U8 = ManifestAstValue.U8;
const U16 = ManifestAstValue.U16;
const U32 = ManifestAstValue.U32;
const U64 = ManifestAstValue.U64;
const U128 = ManifestAstValue.U128;
const I8 = ManifestAstValue.I8;
const I16 = ManifestAstValue.I16;
const I32 = ManifestAstValue.I32;
const I64 = ManifestAstValue.I64;
const I128 = ManifestAstValue.I128;
const String = ManifestAstValue.String;
const Enum = ManifestAstValue.Enum;
const Some = ManifestAstValue.Some;
const None = ManifestAstValue.None;
const Ok = ManifestAstValue.Ok;
const Err = ManifestAstValue.Err;
const Array = ManifestAstValue.Array;
const Map = ManifestAstValue.Map;
const Tuple = ManifestAstValue.Tuple;
const Decimal = ManifestAstValue.Decimal;
const PreciseDecimal = ManifestAstValue.PreciseDecimal;
const Address = ManifestAstValue.Address;
const Bucket = ManifestAstValue.Bucket;
const Proof = ManifestAstValue.Proof;
const NonFungibleLocalId = ManifestAstValue.NonFungibleLocalId;
const NonFungibleGlobalId = ManifestAstValue.NonFungibleGlobalId;
const Expression = ManifestAstValue.Expression;
const Blob = ManifestAstValue.Blob;
const Bytes = ManifestAstValue.Bytes;

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
    expectedObject: new Enum(new EnumU8Discriminator(1)),
    expectedSerialization: `{"kind":"Enum","variant":{"type":"U8","discriminator":"1"},"fields":[]}`,
  },
  {
    expectedObject: new Enum(new EnumStringDiscriminator("EnumName::Variant")),
    expectedSerialization: `{"kind":"Enum","variant":{"type":"String","discriminator":"EnumName::Variant"},"fields":[]}`,
  },
  {
    expectedObject: new Enum(new EnumU8Discriminator(1), [new U8(1)]),
    expectedSerialization: `{"kind":"Enum","variant":{"type":"U8","discriminator":"1"},"fields":[{"kind":"U8","value":"1"}]}`,
  },
  {
    expectedObject: new Enum(new EnumStringDiscriminator("EnumName::Variant"), [
      new U8(1),
    ]),
    expectedSerialization: `{"kind":"Enum","variant":{"type":"String","discriminator":"EnumName::Variant"},"fields":[{"kind":"U8","value":"1"}]}`,
  },
  {
    expectedObject: new Some(new U8(1)),
    expectedSerialization: `{"kind":"Some","value":{"kind":"U8","value":"1"}}`,
  },
  {
    expectedObject: new None(),
    expectedSerialization: `{"kind":"None"}`,
  },
  {
    expectedObject: new Ok(new U8(1)),
    expectedSerialization: `{"kind":"Ok","value":{"kind":"U8","value":"1"}}`,
  },
  {
    expectedObject: new Err(new U8(1)),
    expectedSerialization: `{"kind":"Err","value":{"kind":"U8","value":"1"}}`,
  },
  {
    expectedObject: new Array(Kind.U8, [new U8(1), new U8(2), new U8(3)]),
    expectedSerialization: `{"kind":"Array","element_kind":"U8","elements":[{"kind":"U8","value":"1"},{"kind":"U8","value":"2"},{"kind":"U8","value":"3"}]}`,
  },
  {
    expectedObject: new Map(Kind.U8, Kind.String, [
      [new U8(65), new String("A")],
      [new U8(66), new String("B")],
    ]),
    expectedSerialization: `{"kind":"Map","key_kind":"U8","value_kind":"String","entries":[[{"kind":"U8","value":"65"},{"kind":"String","value":"A"}],[{"kind":"U8","value":"66"},{"kind":"String","value":"B"}]]}`,
  },
  {
    expectedObject: new Tuple([
      new Tuple([new U8(1), new String("Something")]),
    ]),
    expectedSerialization: `{"kind":"Tuple","fields":[{"kind":"Tuple","fields":[{"kind":"U8","value":"1"},{"kind":"String","value":"Something"}]}]}`,
  },
  {
    expectedObject: new Decimal("1"),
    expectedSerialization: `{"kind":"Decimal","value":"1"}`,
  },
  {
    expectedObject: new PreciseDecimal("1"),
    expectedSerialization: `{"kind":"PreciseDecimal","value":"1"}`,
  },
  {
    expectedObject: new Address(
      "package_rdx1pkgxxxxxxxxxfaucetxxxxxxxxx000034355863xxxxxxxxxfaucet"
    ),
    expectedSerialization: `{"kind":"Address","value":"package_rdx1pkgxxxxxxxxxfaucetxxxxxxxxx000034355863xxxxxxxxxfaucet"}`,
  },
  {
    expectedObject: new Address(
      "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"
    ),
    expectedSerialization: `{"kind":"Address","value":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"}`,
  },
  {
    expectedObject: new Address(
      "clock_rdx1skxxxxxxxxxxclckxxxxxxxxxxx002253583992xxxxxxxxxclckxx"
    ),
    expectedSerialization: `{"kind":"Address","value":"clock_rdx1skxxxxxxxxxxclckxxxxxxxxxxx002253583992xxxxxxxxxclckxx"}`,
  },
  {
    expectedObject: new Bucket("bucket"),
    expectedSerialization: `{"kind":"Bucket","value":"bucket"}`,
  },
  {
    expectedObject: new Proof("proof"),
    expectedSerialization: `{"kind":"Proof","value":"proof"}`,
  },
  {
    expectedObject: new NonFungibleLocalId(
      "{b55081fa-9cd1-48c2-95d4-efe2db322a54}"
    ),
    expectedSerialization: `{"kind":"NonFungibleLocalId","value":"{b55081fa-9cd1-48c2-95d4-efe2db322a54}"}`,
  },
  {
    expectedObject: new NonFungibleGlobalId(
      new Address(
        "resource_rdx1nfxxxxxxxxxxsecpsgxxxxxxxxx004638826440xxxxxxxxxsecpsg"
      ),
      new NonFungibleLocalId("{b55081fa-9cd1-48c2-95d4-efe2db322a54}")
    ),
    expectedSerialization: `{"kind":"NonFungibleGlobalId","resource_address":{"kind":"Address","value":"resource_rdx1nfxxxxxxxxxxsecpsgxxxxxxxxx004638826440xxxxxxxxxsecpsg"},"non_fungible_local_id":{"kind":"NonFungibleLocalId","value":"{b55081fa-9cd1-48c2-95d4-efe2db322a54}"}}`,
  },
  {
    expectedObject: Expression.entireAuthZone(),
    expectedSerialization: `{"kind":"Expression","value":"ENTIRE_AUTH_ZONE"}`,
  },
  {
    expectedObject: new Blob(
      "d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"
    ),
    expectedSerialization: `{"kind":"Blob","value":"d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"}`,
  },
  {
    expectedObject: new Bytes(
      "d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"
    ),
    expectedSerialization: `{"kind":"Bytes","hex":"d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"}`,
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
