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
  RawRadixEngineToolkit,
  SborDecodeInput,
  SborValue,
  ScryptoSborValue,
} from "../../src";

describe.each([
  {
    expectedEncoding: Convert.Uint8Array.from("5c0701"),
    expectedValue: new SborValue.ScryptoSbor(new ScryptoSborValue.U8(1)),
  },
])(
  "SBOR Encoding and Decoding for for $expectedEncoding",
  ({ expectedEncoding, expectedValue }) => {
    test(`${expectedValue} encodes to ${expectedEncoding}`, async () => {
      // Act
      let encoding = await RawRadixEngineToolkit.sborEncode(expectedValue);

      // Assert
      expect(encoding.encodedValue).toEqual(expectedEncoding);
    });

    test(`${expectedEncoding} decodes to ${expectedValue}`, async () => {
      // Act
      let value = await RawRadixEngineToolkit.sborDecode(
        new SborDecodeInput(expectedEncoding, 0xf2)
      );

      // Assert
      expect(value).toEqual(expectedValue);
    });
  }
);
