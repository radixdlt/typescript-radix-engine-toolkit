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
  RadixEngineToolkit,
  TransactionHeader,
  TransactionIntent,
  TransactionManifest,
} from "../../src";
import { stringToUint8Array } from "../../src/utils";

describe.each([
  {
    expectedIntent: new TransactionIntent(
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
        new InstructionList.StringInstructions("DROP_ALL_PROOFS;\n"),
        []
      )
    ),
    expectedCompiledIntent: stringToUint8Array(
      "4d21022109070107010a64000000000000000a69000000000000000a18140000000000002200012007210279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f8179801000900e1f505080c0021022022011000202000"
    ),
  },
])(
  "Compilation Test for $intent",
  ({ expectedIntent, expectedCompiledIntent }) => {
    test(`${expectedIntent} is compiled as expected`, async () => {
      // Act
      let compiledIntent = (
        await RadixEngineToolkit.compileTransactionIntent(expectedIntent)
      ).compiledIntent;

      // Assert
      expect(compiledIntent).toEqual(expectedCompiledIntent);
    });

    test(`${expectedIntent} is decompiled as expected`, async () => {
      // Act
      let intent = await RadixEngineToolkit.decompileTransactionIntent(
        expectedCompiledIntent
      );

      // Assert
      expect(intent).toEqual(expectedIntent);
    });

    test(`${expectedIntent} as unknown is decompiled as expected`, async () => {
      // Act
      let intent = await RadixEngineToolkit.decompileUnknownTransactionIntent(
        expectedCompiledIntent
      );

      // Assert
      expect(intent.value).toEqual(expectedIntent);
    });

    test(`Shorthand decompile transaction intent succeeds`, async () => {
      // Act
      let recompiled = await TransactionIntent.decompile(
        expectedCompiledIntent
      ).then((intent) => intent.compile());

      // Assert
      expect(recompiled).toEqual(expectedCompiledIntent);
    });
  }
);
