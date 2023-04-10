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
import {
  InstructionList,
  PublicKey,
  TransactionHeader,
  TransactionIntent,
  TransactionManifest,
} from "../../src";
import { deserialize, serialize, stringToUint8Array } from "../../src/utils";
import { assertSerializationEquals } from "../test_utils";

describe.each([
  {
    expectedObject: new TransactionIntent(
      new TransactionHeader(
        1,
        1,
        100,
        105,
        5144,
        new PublicKey.EcdsaSecp256k1(
          stringToUint8Array(
            "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
          )
        ),
        false,
        100000000,
        12
      ),
      new TransactionManifest(
        new InstructionList.StringInstructions("DROP_ALL_PROOFS;"),
        []
      )
    ),
    expectedSerialization: `{"header":{"version":"1","network_id":"1","start_epoch_inclusive":"100","end_epoch_exclusive":"105","nonce":"5144","notary_public_key":{"curve":"EcdsaSecp256k1","public_key":"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"},"notary_as_signatory":false,"cost_unit_limit":"100000000","tip_percentage":"12"},"manifest":{"instructions":{"type":"String","value":"DROP_ALL_PROOFS;"},"blobs":[]}}`,
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
