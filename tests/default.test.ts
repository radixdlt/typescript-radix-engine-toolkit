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
    const testVectorsProvider = new TestVectorsProvider<
      DeriveVirtualAccountAddressFromPublicKeyInput,
      DeriveVirtualAccountAddressFromPublicKeyOutput
    >("derive", "derive_virtual_account_address_from_public_key");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
          GeneratedConverter.PublicKey.fromGenerated(inputVector.public_key),
          Convert.String.toNumber(inputVector.network_id)
        );

      // Assert
      expect(output).toEqual(outputVector);
    });
  });

  it("Derive Virtual Identity Address From Public Key works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      DeriveVirtualIdentityAddressFromPublicKeyInput,
      DeriveVirtualIdentityAddressFromPublicKeyOutput
    >("derive", "derive_virtual_identity_address_from_public_key");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.Derive.virtualIdentityAddressFromPublicKey(
          GeneratedConverter.PublicKey.fromGenerated(inputVector.public_key),
          Convert.String.toNumber(inputVector.network_id)
        );
      // Assert
      expect(output).toEqual(outputVector);
    });
  });

  it("Derive Virtual Account Address From Olympia Account Address works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      DeriveVirtualAccountAddressFromOlympiaAccountAddressInput,
      DeriveVirtualAccountAddressFromOlympiaAccountAddressOutput
    >("derive", "derive_virtual_account_address_from_olympia_account_address");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.Derive.virtualAccountAddressFromOlympiaAccountAddress(
          inputVector.olympia_account_address,
          Convert.String.toNumber(inputVector.network_id)
        );
      // Assert
      expect(output).toEqual(outputVector);
    });
  });

  it("Derive Public Key From Olympia Account Address works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      DerivePublicKeyFromOlympiaAccountAddressInput,
      DerivePublicKeyFromOlympiaAccountAddressOutput
    >("derive", "derive_public_key_from_olympia_account_address");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.Derive.publicKeyFromOlympiaAccountAddress(
          inputVector
        );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    });
  });

  it("Derive Olympia Address from Public Key works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      DeriveOlympiaAccountAddressFromPublicKeyInput,
      DeriveOlympiaAccountAddressFromPublicKeyOutput
    >("derive", "derive_olympia_account_address_from_public_key");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.Derive.olympiaAccountAddressFromPublicKey(
          Convert.HexString.toUint8Array(inputVector.public_key),
          GeneratedConverter.OlympiaNetwork.fromGenerated(
            inputVector.olympia_network
          )
        );

      // Assert
      expect(output).toEqual(outputVector);
    });
  });

  it("Derive Node Address from Public Key works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      DeriveNodeAddressFromPublicKeyInput,
      DeriveNodeAddressFromPublicKeyOutput
    >("derive", "derive_node_address_from_public_key");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Derive.nodeAddressFromPublicKey(
        Convert.HexString.toUint8Array(inputVector.public_key),
        Convert.String.toNumber(inputVector.network_id)
      );

      // Assert
      expect(output).toEqual(outputVector);
    });
  });
});

class TestVectorsProvider<I, O> {
  private testVectors: {
    input: I;
    output: O;
  }[];

  constructor(moduleName: string, functionName: string) {
    const fileContent = fs.readFileSync(
      `./resources/function_examples/${moduleName}.json`,
      "utf8"
    );
    this.testVectors = JSON.parse(fileContent)[functionName];
  }

  async forEach(callback: (input: I, output: O) => void): Promise<void> {
    for (const { input, output } of this.testVectors) {
      await callback(input, output);
    }
  }
}
