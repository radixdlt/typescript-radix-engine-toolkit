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
import { InstructionList } from "../../src";
import { DropAllProofs } from "../../src/models/transaction/instruction";
import { deserialize, serialize } from "../../src/utils";

describe.each([
  {
    expectedObject: new InstructionList.StringInstructions("DROP_ALL_PROOFS;"),
    expectedSerialization: `{"type":"String","value":"DROP_ALL_PROOFS;"}`,
  },
  {
    expectedObject: new InstructionList.ParsedInstructions([
      new DropAllProofs(),
    ]),
    expectedSerialization: `{"type":"Parsed","value":[{"instruction":"DROP_ALL_PROOFS"}]}`,
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
