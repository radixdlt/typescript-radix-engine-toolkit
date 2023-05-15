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
import { RadixEngineToolkit } from "../src";
import { deserialize, serialize } from "../src/utils";
import { assertSerializationEquals } from "./test_utils";

describe.each([
  {
    expectedObject:
      "component_sim1qd8djmepmq7hxqaakt9rl3hkce532px42s8eh4qmqlks9f87dn",
    expectedSerialization: `{"type":"ComponentAddress","address":"component_sim1qd8djmepmq7hxqaakt9rl3hkce532px42s8eh4qmqlks9f87dn"}`,
    expectedNetworkId: 0xf2,
  },
  {
    expectedObject:
      "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k",
    expectedSerialization: `{"type":"ResourceAddress","address":"resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"}`,
    expectedNetworkId: 0xf2,
  },
  {
    expectedObject:
      "package_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqs767h4",
    expectedSerialization: `{"type":"PackageAddress","address":"package_rdx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqs767h4"}`,
    expectedNetworkId: 0x1,
  },
])(
  "Serialization test for $expectedSerialization",
  ({ expectedObject, expectedSerialization, expectedNetworkId }) => {
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

    test(`Network id of ${expectedObject} is ${expectedNetworkId}`, async () => {
      // Act
      let networkId = (await RadixEngineToolkit.decodeAddress(expectedObject))
        .networkId;

      // Assert
      expect(networkId).toEqual(expectedNetworkId);
    });
  }
);
