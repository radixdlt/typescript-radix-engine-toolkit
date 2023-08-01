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
  InstructionsCompileInput,
  InstructionsCompileOutput,
  InstructionsConvertInput,
  InstructionsConvertOutput,
  InstructionsDecompileInput,
  InstructionsDecompileOutput,
  InstructionsExtractAddressesInput,
  InstructionsExtractAddressesOutput,
  InstructionsStaticallyValidateInput,
  InstructionsStaticallyValidateOutput,
  IntentCompileInput,
  IntentCompileOutput,
  IntentDecompileInput,
  IntentDecompileOutput,
  IntentHashInput,
  IntentHashOutput,
  IntentStaticallyValidateInput,
  IntentStaticallyValidateOutput,
  ManifestCompileInput,
  ManifestCompileOutput,
  ManifestDecompileInput,
  ManifestDecompileOutput,
  ManifestStaticallyValidateInput,
  ManifestStaticallyValidateOutput,
  NotarizedTransactionCompileInput,
  NotarizedTransactionCompileOutput,
  NotarizedTransactionDecompileInput,
  NotarizedTransactionDecompileOutput,
  NotarizedTransactionHashInput,
  NotarizedTransactionHashOutput,
  NotarizedTransactionStaticallyValidateInput,
  NotarizedTransactionStaticallyValidateOutput,
  SignedIntentCompileInput,
  SignedIntentCompileOutput,
  SignedIntentDecompileInput,
  SignedIntentDecompileOutput,
  SignedIntentHashInput,
  SignedIntentHashOutput,
  SignedIntentStaticallyValidateInput,
  SignedIntentStaticallyValidateOutput,
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

  it("Convert Instructions works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      InstructionsConvertInput,
      InstructionsConvertOutput
    >("instructions", "instructions_convert");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Instructions.convert(
        GeneratedConverter.Instructions.fromGenerated(inputVector.instructions),
        Convert.String.toNumber(inputVector.network_id),
        inputVector.instructions_kind
      );

      // Assert
      expect(GeneratedConverter.Instructions.toGenerated(output)).toEqual(
        outputVector
      );
    });
  });

  it("Compile Instructions works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      InstructionsCompileInput,
      InstructionsCompileOutput
    >("instructions", "instructions_compile");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Instructions.compile(
        GeneratedConverter.Instructions.fromGenerated(inputVector.instructions),
        Convert.String.toNumber(inputVector.network_id)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    });
  });

  it("Decompile Instructions works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      InstructionsDecompileInput,
      InstructionsDecompileOutput
    >("instructions", "instructions_decompile");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Instructions.decompile(
        Convert.HexString.toUint8Array(inputVector.compiled),
        Convert.String.toNumber(inputVector.network_id),
        inputVector.instructions_kind
      );

      // Assert
      expect(GeneratedConverter.Instructions.toGenerated(output)).toEqual(
        outputVector
      );
    });
  });

  it("Extract Addresses from Instructions works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      InstructionsExtractAddressesInput,
      InstructionsExtractAddressesOutput
    >("instructions", "instructions_extract_addresses");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Instructions.extractAddresses(
        GeneratedConverter.Instructions.fromGenerated(inputVector.instructions),
        Convert.String.toNumber(inputVector.network_id)
      );

      // Assert
      expect(convertRecordValueToSet(output)).toEqual(
        convertRecordValueToSet(outputVector.addresses)
      );
    });
  });

  it("Statically Validate Instructions works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      InstructionsStaticallyValidateInput,
      InstructionsStaticallyValidateOutput
    >("instructions", "instructions_statically_validate");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Instructions.staticallyValidate(
        GeneratedConverter.Instructions.fromGenerated(inputVector.instructions),
        Convert.String.toNumber(inputVector.network_id)
      );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
    });
  });

  it("Compile Manifest works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      ManifestCompileInput,
      ManifestCompileOutput
    >("manifest", "manifest_compile");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.TransactionManifest.compile(
        GeneratedConverter.TransactionManifest.fromGenerated(
          inputVector.manifest
        ),
        Convert.String.toNumber(inputVector.network_id)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    });
  });

  it("Decompile TransactionManifest works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      ManifestDecompileInput,
      ManifestDecompileOutput
    >("manifest", "manifest_decompile");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.TransactionManifest.decompile(
        Convert.HexString.toUint8Array(inputVector.compiled),
        Convert.String.toNumber(inputVector.network_id),
        inputVector.instructions_kind
      );

      // Assert
      expect(
        GeneratedConverter.TransactionManifest.toGenerated(output)
      ).toEqual(outputVector);
    });
  });

  it("Statically Validate TransactionManifest works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      ManifestStaticallyValidateInput,
      ManifestStaticallyValidateOutput
    >("manifest", "manifest_statically_validate");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.TransactionManifest.staticallyValidate(
          GeneratedConverter.TransactionManifest.fromGenerated(
            inputVector.manifest
          ),
          Convert.String.toNumber(inputVector.network_id)
        );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
    });
  });

  it("Compile Intent works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      IntentCompileInput,
      IntentCompileOutput
    >("intent", "intent_compile");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Intent.compile(
        GeneratedConverter.Intent.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    });
  });

  it("Hash Intent works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      IntentHashInput,
      IntentHashOutput
    >("intent", "intent_hash");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Intent.hash(
        GeneratedConverter.Intent.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    });
  });

  it("Decompile Intent works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      IntentDecompileInput,
      IntentDecompileOutput
    >("intent", "intent_decompile");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Intent.decompile(
        Convert.HexString.toUint8Array(inputVector.compiled),
        inputVector.instructions_kind
      );

      // Assert
      expect(GeneratedConverter.Intent.toGenerated(output)).toEqual(
        outputVector
      );
    });
  });

  it("Statically Validate Intent works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      IntentStaticallyValidateInput,
      IntentStaticallyValidateOutput
    >("intent", "intent_statically_validate");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Intent.staticallyValidate(
        GeneratedConverter.Intent.fromGenerated(inputVector.intent),
        GeneratedConverter.ValidationConfig.fromGenerated(
          inputVector.validation_config
        )
      );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
    });
  });

  it("Compile SignedIntent works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      SignedIntentCompileInput,
      SignedIntentCompileOutput
    >("signed_intent", "signed_intent_compile");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.SignedIntent.compile(
        GeneratedConverter.SignedIntent.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    });
  });

  it("Hash SignedIntent works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      SignedIntentHashInput,
      SignedIntentHashOutput
    >("signed_intent", "signed_intent_hash");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.SignedIntent.hash(
        GeneratedConverter.SignedIntent.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    });
  });

  it("Decompile SignedIntent works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      SignedIntentDecompileInput,
      SignedIntentDecompileOutput
    >("signed_intent", "signed_intent_decompile");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.SignedIntent.decompile(
        Convert.HexString.toUint8Array(inputVector.compiled),
        inputVector.instructions_kind
      );

      // Assert
      expect(GeneratedConverter.SignedIntent.toGenerated(output)).toEqual(
        outputVector
      );
    });
  });

  it("Statically Validate SignedIntent works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      SignedIntentStaticallyValidateInput,
      SignedIntentStaticallyValidateOutput
    >("signed_intent", "signed_intent_statically_validate");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.SignedIntent.staticallyValidate(
        GeneratedConverter.SignedIntent.fromGenerated(
          inputVector.signed_intent
        ),
        GeneratedConverter.ValidationConfig.fromGenerated(
          inputVector.validation_config
        )
      );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
    });
  });

  it("Compile NotarizedTransaction works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      NotarizedTransactionCompileInput,
      NotarizedTransactionCompileOutput
    >("notarized_transaction", "notarized_transaction_compile");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.NotarizedTransaction.compile(
        GeneratedConverter.NotarizedTransaction.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    });
  });

  it("Hash NotarizedTransaction works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      NotarizedTransactionHashInput,
      NotarizedTransactionHashOutput
    >("notarized_transaction", "notarized_transaction_hash");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.NotarizedTransaction.hash(
        GeneratedConverter.NotarizedTransaction.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    });
  });

  it("Decompile NotarizedTransaction works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      NotarizedTransactionDecompileInput,
      NotarizedTransactionDecompileOutput
    >("notarized_transaction", "notarized_transaction_decompile");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.NotarizedTransaction.decompile(
        Convert.HexString.toUint8Array(inputVector.compiled),
        inputVector.instructions_kind
      );

      // Assert
      expect(
        GeneratedConverter.NotarizedTransaction.toGenerated(output)
      ).toEqual(outputVector);
    });
  });

  it("Statically Validate NotarizedTransaction works as expected", async () => {
    // Arrange
    const testVectorsProvider = new TestVectorsProvider<
      NotarizedTransactionStaticallyValidateInput,
      NotarizedTransactionStaticallyValidateOutput
    >("notarized_transaction", "notarized_transaction_statically_validate");

    await testVectorsProvider.forEach(async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
          GeneratedConverter.NotarizedTransaction.fromGenerated(
            inputVector.notarized_transaction
          ),
          GeneratedConverter.ValidationConfig.fromGenerated(
            inputVector.validation_config
          )
        );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
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

  async forEach(
    callback: (input: I, output: O) => Promise<void>
  ): Promise<void> {
    for (const { input, output } of this.testVectors) {
      await callback(input, output);
    }
  }
}

function convertRecordValueToSet<K extends string | number | symbol, V>(
  map: Record<K, V[]>
): Record<K, Set<V>> {
  // @ts-ignore
  let newMap: Record<K, Set<V>> = {};
  for (const key in map) {
    const value = map[key];
    newMap[key] = new Set(value);
  }
  return newMap;
}
