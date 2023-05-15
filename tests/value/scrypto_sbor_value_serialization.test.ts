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
import { Convert, ScryptoSborValue } from "../../src";
import { deserialize, serialize } from "../../src/utils";
import { assertSerializationEquals } from "../test_utils";

const Kind = ScryptoSborValue.Kind;
const Bool = ScryptoSborValue.Bool;
const U8 = ScryptoSborValue.U8;
const U16 = ScryptoSborValue.U16;
const U32 = ScryptoSborValue.U32;
const U64 = ScryptoSborValue.U64;
const U128 = ScryptoSborValue.U128;
const I8 = ScryptoSborValue.I8;
const I16 = ScryptoSborValue.I16;
const I32 = ScryptoSborValue.I32;
const I64 = ScryptoSborValue.I64;
const I128 = ScryptoSborValue.I128;
const String = ScryptoSborValue.String;
const Enum = ScryptoSborValue.Enum;
const Array = ScryptoSborValue.Array;
const Map = ScryptoSborValue.Map;
const Tuple = ScryptoSborValue.Tuple;
const Address = ScryptoSborValue.Address;
const Own = ScryptoSborValue.Own;
const Decimal = ScryptoSborValue.Decimal;
const PreciseDecimal = ScryptoSborValue.PreciseDecimal;
const NonFungibleLocalId = ScryptoSborValue.NonFungibleLocalId;
const Reference = ScryptoSborValue.Reference;
const Bytes = ScryptoSborValue.Bytes;

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
    expectedObject: new Own(
      "package_rdx1pkgxxxxxxxxxaccntxxxxxxxxxx000929625493xxxxxxxxxaccntx"
    ),
    expectedSerialization: `{"kind":"Own","value":"package_rdx1pkgxxxxxxxxxaccntxxxxxxxxxx000929625493xxxxxxxxxaccntx"}`,
  },
  {
    expectedObject: new NonFungibleLocalId(
      "{b55081fa-9cd1-48c2-95d4-efe2db322a54}"
    ),
    expectedSerialization: `{"kind":"NonFungibleLocalId","value":"{b55081fa-9cd1-48c2-95d4-efe2db322a54}"}`,
  },
  {
    expectedObject: new Reference(
      "package_rdx1pkgxxxxxxxxxaccntxxxxxxxxxx000929625493xxxxxxxxxaccntx"
    ),
    expectedSerialization: `{"kind":"Reference","value":"package_rdx1pkgxxxxxxxxxaccntxxxxxxxxxx000929625493xxxxxxxxxaccntx"}`,
  },
  {
    expectedObject: new Address(
      "clock_rdx1skxxxxxxxxxxclckxxxxxxxxxxx002253583992xxxxxxxxxclckxx"
    ),
    expectedSerialization: `{"kind":"Address","value":"clock_rdx1skxxxxxxxxxxclckxxxxxxxxxxx002253583992xxxxxxxxxclckxx"}`,
  },
  {
    expectedObject: new Bytes(
      Convert.HexString.toUint8Array(
        "d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"
      )
    ),
    expectedSerialization: `{"kind":"Bytes","element_kind":"U8","hex":"d28d2c3710601fbc097000ec73455693f4861dc0eb7c90d8821f2a13f617313e"}`,
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
