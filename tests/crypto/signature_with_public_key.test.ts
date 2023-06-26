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
import { SignatureWithPublicKey } from "../../src";
import { deserialize, serialize } from "../../src/utils";
import { assertSerializationEquals } from "../test_utils";

describe.each([
  {
    expectedObject: new SignatureWithPublicKey.Secp256k1(
      "007f054d0a376fb5cce93c5836531ce5d116dcdb134211650553ddeba408e53b4725b8fe89d120c41667fe457acae408025371a61b8fe05b20d2c2b9e8d81f1a53"
    ),
    expectedSerialization: `{"curve":"Secp256k1","signature":"007f054d0a376fb5cce93c5836531ce5d116dcdb134211650553ddeba408e53b4725b8fe89d120c41667fe457acae408025371a61b8fe05b20d2c2b9e8d81f1a53"}`,
  },
  {
    expectedObject: new SignatureWithPublicKey.Ed25519(
      "e5f1e508cc91a95a280613618a1ccb5142744b5b8a6042e232dcaadf17e41f1f0131d535ea3fa56b6ae8164586cd6b4e89e3224e994b3109ca51cae02e7dce01",
      "4cb5abf6ad79fbf5abbccafcc269d85cd2651ed4b885b5869f241aedf0a5ba29"
    ),
    expectedSerialization: `{"curve":"Ed25519","signature":"e5f1e508cc91a95a280613618a1ccb5142744b5b8a6042e232dcaadf17e41f1f0131d535ea3fa56b6ae8164586cd6b4e89e3224e994b3109ca51cae02e7dce01","public_key":"4cb5abf6ad79fbf5abbccafcc269d85cd2651ed4b885b5869f241aedf0a5ba29"}`,
  },
])(
  "Serialization test for $expectedSerialization",
  ({ expectedObject, expectedSerialization }) => {
    test(`${expectedObject} is serialized as expected`, () => {
      // Act
      const actualSerialization = serialize(expectedObject);

      // Assert
      assertSerializationEquals(actualSerialization, expectedSerialization);
    });

    test(`${expectedSerialization} is deserialized as expected`, () => {
      // Act
      const actualObject = deserialize(
        expectedSerialization,
        // @ts-ignore
        expectedObject.constructor
      );

      // Assert
      expect(actualObject).toEqual(expectedObject);
    });
  }
);
