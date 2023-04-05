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

import { InstructionList, TransactionManifest } from "../../src";
import { describe, expect, test } from "vitest";
import { deserialize, serialize } from "../../src/utils";
import { blake2b } from "blakejs";

describe.each([
  {
    expectedObject: new TransactionManifest(
      new InstructionList.StringInstructions("DROP_ALL_PROOFS;")
    ),
    expectedSerialization: `{"instructions":{"type":"String","value":"DROP_ALL_PROOFS;"},"blobs":[]}`,
  },
  {
    expectedObject: new TransactionManifest(
      new InstructionList.StringInstructions("DROP_ALL_PROOFS;"),
      [blake2b(new Uint8Array([0x10]), undefined, 32)]
    ),
    expectedSerialization: `{"instructions":{"type":"String","value":"DROP_ALL_PROOFS;"},"blobs":["6e30ba9e2f411e40b031121ddef5821b1cf6627fa618fd3a45936d567b7b0683"]}`,
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
