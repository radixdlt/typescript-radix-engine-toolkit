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
  Convert,
  DecompileTransactionIntentInput,
  DecompileUnknownTransactionIntentInput,
  InstructionList,
  PublicKey,
  RawRadixEngineToolkit,
  TransactionHeader,
  TransactionIntent,
  TransactionManifest,
} from "../../src";
import {} from "../../src/utils";

describe.each([
  {
    expectedIntent: new TransactionIntent(
      new TransactionHeader(
        1,
        100,
        105,
        5144,
        new PublicKey.EcdsaSecp256k1(
          "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
        ),
        false,
        12
      ),
      new TransactionManifest(
        new InstructionList.StringInstructions("DROP_ALL_PROOFS;\n"),
        []
      )
    ),
    expectedCompiledIntent: Convert.Uint8Array.from(
      "4d220104210707010a64000000000000000a690000000000000009181400002200012007210279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f817980100080c0020220150002020002100"
    ),
  },
])(
  "Compilation Test for $intent",
  ({ expectedIntent, expectedCompiledIntent }) => {
    test(`${expectedIntent} is compiled as expected`, async () => {
      // Act
      let compiledIntent = (
        await RawRadixEngineToolkit.compileTransactionIntent(expectedIntent)
      ).compiledIntent;

      // Assert
      expect(compiledIntent).toEqual(expectedCompiledIntent);
    });

    test(`${expectedIntent} is decompiled as expected`, async () => {
      // Act
      let intent = await RawRadixEngineToolkit.decompileTransactionIntent(
        new DecompileTransactionIntentInput(
          InstructionList.Kind.String,
          expectedCompiledIntent
        )
      );

      // Assert
      expect(intent).toEqual(expectedIntent);
    });

    test(`${expectedIntent} as unknown is decompiled as expected`, async () => {
      // Act
      let intent =
        await RawRadixEngineToolkit.decompileUnknownTransactionIntent(
          new DecompileUnknownTransactionIntentInput(
            InstructionList.Kind.String,
            expectedCompiledIntent
          )
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
