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

import * as fs from "fs";
import { describe, expect, it } from "vitest";
import { Convert, RadixEngineToolkit } from "../src";
import {
  DeriveNodeAddressFromPublicKeyInput,
  DeriveNodeAddressFromPublicKeyOutput,
  DeriveOlympiaAccountAddressFromPublicKeyInput,
  DeriveOlympiaAccountAddressFromPublicKeyOutput,
  DerivePublicKeyFromOlympiaAccountAddressInput,
  DerivePublicKeyFromOlympiaAccountAddressOutput,
  DeriveVirtualAccountAddressFromOlympiaAccountAddressInput,
  DeriveVirtualAccountAddressFromOlympiaAccountAddressOutput,
  DeriveVirtualAccountAddressFromPublicKeyInput,
  DeriveVirtualAccountAddressFromPublicKeyOutput,
  DeriveVirtualIdentityAddressFromPublicKeyInput,
  DeriveVirtualIdentityAddressFromPublicKeyOutput,
  GeneratedConverter,
} from "../src/generated";

describe("Default Radix Engine Toolkit Tests", () => {
  it("Build Information can be obtained from the toolkit", async () => {
    // Act
    const buildInformation = await RadixEngineToolkit.Build.information();

    // Assert
    expect(buildInformation.version).toEqual("0.12.0");
  });

  it("Derive Virtual Account Address From Public Key works as expected", async () => {
    // Arrange
    const fileContent = fs.readFileSync(
      "./resources/function_examples/derive.json",
      "utf8"
    );
    const examples: {
      input: DeriveVirtualAccountAddressFromPublicKeyInput;
      output: DeriveVirtualAccountAddressFromPublicKeyOutput;
    }[] =
      JSON.parse(fileContent)["derive_virtual_account_address_from_public_key"];

    for (const {
      input: serializableInput,
      output: expectedOutput,
    } of examples) {
      // Act
      const output =
        await RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
          GeneratedConverter.PublicKey.fromGenerated(
            serializableInput.public_key
          ),
          Convert.String.toNumber(serializableInput.network_id)
        );

      // Assert
      expect(output).toEqual(expectedOutput);
    }
  });

  it("Derive Virtual Identity Address From Public Key works as expected", async () => {
    // Arrange
    const fileContent = fs.readFileSync(
      "./resources/function_examples/derive.json",
      "utf8"
    );
    const examples: {
      input: DeriveVirtualIdentityAddressFromPublicKeyInput;
      output: DeriveVirtualIdentityAddressFromPublicKeyOutput;
    }[] =
      JSON.parse(fileContent)[
        "derive_virtual_identity_address_from_public_key"
      ];

    for (const {
      input: serializableInput,
      output: expectedOutput,
    } of examples) {
      // Act
      const output =
        await RadixEngineToolkit.Derive.virtualIdentityAddressFromPublicKey(
          GeneratedConverter.PublicKey.fromGenerated(
            serializableInput.public_key
          ),
          Convert.String.toNumber(serializableInput.network_id)
        );

      // Assert
      expect(output).toEqual(expectedOutput);
    }
  });

  it("Derive Virtual Account Address From Olympia Account Address works as expected", async () => {
    // Arrange
    const fileContent = fs.readFileSync(
      "./resources/function_examples/derive.json",
      "utf8"
    );
    const examples: {
      input: DeriveVirtualAccountAddressFromOlympiaAccountAddressInput;
      output: DeriveVirtualAccountAddressFromOlympiaAccountAddressOutput;
    }[] =
      JSON.parse(fileContent)[
        "derive_virtual_account_address_from_olympia_account_address"
      ];

    for (const {
      input: serializableInput,
      output: expectedOutput,
    } of examples) {
      // Act
      const output =
        await RadixEngineToolkit.Derive.virtualAccountAddressFromOlympiaAccountAddress(
          serializableInput.olympia_account_address,
          Convert.String.toNumber(serializableInput.network_id)
        );

      // Assert
      expect(output).toEqual(expectedOutput);
    }
  });

  it("Derive Public Key From Olympia Account Address works as expected", async () => {
    // Arrange
    const fileContent = fs.readFileSync(
      "./resources/function_examples/derive.json",
      "utf8"
    );
    const examples: {
      input: DerivePublicKeyFromOlympiaAccountAddressInput;
      output: DerivePublicKeyFromOlympiaAccountAddressOutput;
    }[] =
      JSON.parse(fileContent)["derive_public_key_from_olympia_account_address"];

    for (const {
      input: serializableInput,
      output: expectedOutput,
    } of examples) {
      // Act
      const output =
        await RadixEngineToolkit.Derive.publicKeyFromOlympiaAccountAddress(
          serializableInput
        );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(expectedOutput));
    }
  });

  it("Derive Olympia Address from Public Key works as expected", async () => {
    // Arrange
    const fileContent = fs.readFileSync(
      "./resources/function_examples/derive.json",
      "utf8"
    );
    const examples: {
      input: DeriveOlympiaAccountAddressFromPublicKeyInput;
      output: DeriveOlympiaAccountAddressFromPublicKeyOutput;
    }[] =
      JSON.parse(fileContent)["derive_olympia_account_address_from_public_key"];

    for (const {
      input: serializableInput,
      output: expectedOutput,
    } of examples) {
      // Act
      const output =
        await RadixEngineToolkit.Derive.olympiaAccountAddressFromPublicKey(
          Convert.HexString.toUint8Array(serializableInput.public_key),
          GeneratedConverter.OlympiaNetwork.fromGenerated(
            serializableInput.olympia_network
          )
        );

      // Assert
      expect(output).toEqual(expectedOutput);
    }
  });

  it("Derive Node Address from Public Key works as expected", async () => {
    // Arrange
    const fileContent = fs.readFileSync(
      "./resources/function_examples/derive.json",
      "utf8"
    );
    const examples: {
      input: DeriveNodeAddressFromPublicKeyInput;
      output: DeriveNodeAddressFromPublicKeyOutput;
    }[] = JSON.parse(fileContent)["derive_node_address_from_public_key"];

    for (const {
      input: serializableInput,
      output: expectedOutput,
    } of examples) {
      // Act
      const output = await RadixEngineToolkit.Derive.nodeAddressFromPublicKey(
        Convert.HexString.toUint8Array(serializableInput.public_key),
        Convert.String.toNumber(serializableInput.network_id)
      );

      // Assert
      expect(output).toEqual(expectedOutput);
    }
  });
});
