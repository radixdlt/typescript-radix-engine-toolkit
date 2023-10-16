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

import wasmModule from "../../resources/radix_engine_toolkit.wasm";
import {
  AddressDecodeInput,
  AddressDecodeOutput,
  AddressEntityTypeInput,
  AddressEntityTypeOutput,
  BuildInformationInput,
  BuildInformationOutput,
  DeriveBech32mTransactionIdentifierFromIntentHashInput,
  DeriveBech32mTransactionIdentifierFromIntentHashOutput,
  DeriveNodeAddressFromPublicKeyInput,
  DeriveNodeAddressFromPublicKeyOutput,
  DeriveOlympiaAccountAddressFromPublicKeyInput,
  DeriveOlympiaAccountAddressFromPublicKeyOutput,
  DerivePublicKeyFromOlympiaAccountAddressInput,
  DerivePublicKeyFromOlympiaAccountAddressOutput,
  DeriveResourceAddressFromOlympiaResourceAddressInput,
  DeriveResourceAddressFromOlympiaResourceAddressOutput,
  DeriveVirtualAccountAddressFromOlympiaAccountAddressInput,
  DeriveVirtualAccountAddressFromOlympiaAccountAddressOutput,
  DeriveVirtualAccountAddressFromPublicKeyInput,
  DeriveVirtualAccountAddressFromPublicKeyOutput,
  DeriveVirtualIdentityAddressFromPublicKeyInput,
  DeriveVirtualIdentityAddressFromPublicKeyOutput,
  ExecutionAnalyzeInput,
  ExecutionAnalyzeOutput,
  InstructionsCompileInput,
  InstructionsCompileOutput,
  InstructionsConvertInput,
  InstructionsConvertOutput,
  InstructionsDecompileInput,
  InstructionsDecompileOutput,
  InstructionsExtractAddressesInput,
  InstructionsExtractAddressesOutput,
  InstructionsHashInput,
  InstructionsHashOutput,
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
  ManifestHashInput,
  ManifestHashOutput,
  ManifestSborDecodeToStringInput,
  ManifestSborDecodeToStringOutput,
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
  ScryptoSborDecodeToStringInput,
  ScryptoSborDecodeToStringOutput,
  ScryptoSborEncodeStringRepresentationInput,
  ScryptoSborEncodeStringRepresentationOutput,
  SignedIntentCompileInput,
  SignedIntentCompileOutput,
  SignedIntentDecompileInput,
  SignedIntentDecompileOutput,
  SignedIntentHashInput,
  SignedIntentHashOutput,
  SignedIntentStaticallyValidateInput,
  SignedIntentStaticallyValidateOutput,
  UtilsKnownAddressesInput,
  UtilsKnownAddressesOutput,
} from "../generated";
import { wasmBindgenImports } from "./constants";
import { Host } from "./host";

/**
 * A class that extends {@link Host} providing an even higher level API for calling into the Radix
 * Engine Toolkit.
 *
 * {@link Host} has no understanding of the functions that are exported by the Radix Engine Toolkit,
 * all it knows is that it's a WASM that uses a specific serialization format for all communication.
 * This class extends its functionality by providing the concrete structure of the functions WASM
 * exports, how memory is allocated and deallocated.
 */
export class RawRadixEngineToolkit extends Host<Exports> {
  public buildInformation(
    input: BuildInformationInput
  ): BuildInformationOutput {
    return this.callFunction(input, this.exports.build_information);
  }

  public deriveVirtualAccountAddressFromPublicKey(
    input: DeriveVirtualAccountAddressFromPublicKeyInput
  ): DeriveVirtualAccountAddressFromPublicKeyOutput {
    return this.callFunction(
      input,
      this.exports.derive_virtual_account_address_from_public_key
    );
  }

  public deriveVirtualIdentityAddressFromPublicKey(
    input: DeriveVirtualIdentityAddressFromPublicKeyInput
  ): DeriveVirtualIdentityAddressFromPublicKeyOutput {
    return this.callFunction(
      input,
      this.exports.derive_virtual_identity_address_from_public_key
    );
  }

  public derivePublicKeyFromOlympiaAccountAddress(
    input: DerivePublicKeyFromOlympiaAccountAddressInput
  ): DerivePublicKeyFromOlympiaAccountAddressOutput {
    return this.callFunction(
      input,
      this.exports.derive_public_key_from_olympia_account_address
    );
  }

  public deriveVirtualAccountAddressFromOlympiaAccountAddress(
    input: DeriveVirtualAccountAddressFromOlympiaAccountAddressInput
  ): DeriveVirtualAccountAddressFromOlympiaAccountAddressOutput {
    return this.callFunction(
      input,
      this.exports.derive_virtual_account_address_from_olympia_account_address
    );
  }

  public deriveResourceAddressFromOlympiaResourceAddress(
    input: DeriveResourceAddressFromOlympiaResourceAddressInput
  ): DeriveResourceAddressFromOlympiaResourceAddressOutput {
    return this.callFunction(
      input,
      this.exports.derive_resource_address_from_olympia_resource_address
    );
  }

  public deriveOlympiaAccountAddressFromPublicKey(
    input: DeriveOlympiaAccountAddressFromPublicKeyInput
  ): DeriveOlympiaAccountAddressFromPublicKeyOutput {
    return this.callFunction(
      input,
      this.exports.derive_olympia_account_address_from_public_key
    );
  }

  public deriveBech32mTransactionIdentifierFromIntentHash(
    input: DeriveBech32mTransactionIdentifierFromIntentHashInput
  ): DeriveBech32mTransactionIdentifierFromIntentHashOutput {
    return this.callFunction(
      input,
      this.exports.derive_bech32m_transaction_identifier_from_intent_hash
    );
  }

  public deriveNodeAddressFromPublicKey(
    input: DeriveNodeAddressFromPublicKeyInput
  ): DeriveNodeAddressFromPublicKeyOutput {
    return this.callFunction(
      input,
      this.exports.derive_node_address_from_public_key
    );
  }

  public executionAnalyze(
    input: ExecutionAnalyzeInput
  ): ExecutionAnalyzeOutput {
    return this.callFunction(input, this.exports.execution_analyze);
  }

  public instructionsHash(
    input: InstructionsHashInput
  ): InstructionsHashOutput {
    return this.callFunction(input, this.exports.instructions_hash);
  }

  public instructionsConvert(
    input: InstructionsConvertInput
  ): InstructionsConvertOutput {
    return this.callFunction(input, this.exports.instructions_convert);
  }

  public instructionsCompile(
    input: InstructionsCompileInput
  ): InstructionsCompileOutput {
    return this.callFunction(input, this.exports.instructions_compile);
  }

  public instructionsDecompile(
    input: InstructionsDecompileInput
  ): InstructionsDecompileOutput {
    return this.callFunction(input, this.exports.instructions_decompile);
  }

  public instructionsExtractAddresses(
    input: InstructionsExtractAddressesInput
  ): InstructionsExtractAddressesOutput {
    return this.callFunction(
      input,
      this.exports.instructions_extract_addresses
    );
  }

  public instructionsStaticallyValidate(
    input: InstructionsStaticallyValidateInput
  ): InstructionsStaticallyValidateOutput {
    return this.callFunction(
      input,
      this.exports.instructions_statically_validate
    );
  }

  public manifestHash(input: ManifestHashInput): ManifestHashOutput {
    return this.callFunction(input, this.exports.manifest_hash);
  }

  public manifestCompile(input: ManifestCompileInput): ManifestCompileOutput {
    return this.callFunction(input, this.exports.manifest_compile);
  }

  public manifestDecompile(
    input: ManifestDecompileInput
  ): ManifestDecompileOutput {
    return this.callFunction(input, this.exports.manifest_decompile);
  }

  public manifestStaticallyValidate(
    input: ManifestStaticallyValidateInput
  ): ManifestStaticallyValidateOutput {
    return this.callFunction(input, this.exports.manifest_statically_validate);
  }

  public intentHash(input: IntentHashInput): IntentHashOutput {
    return this.callFunction(input, this.exports.intent_hash);
  }

  public intentCompile(input: IntentCompileInput): IntentCompileOutput {
    return this.callFunction(input, this.exports.intent_compile);
  }

  public intentDecompile(input: IntentDecompileInput): IntentDecompileOutput {
    return this.callFunction(input, this.exports.intent_decompile);
  }

  public intentStaticallyValidate(
    input: IntentStaticallyValidateInput
  ): IntentStaticallyValidateOutput {
    return this.callFunction(input, this.exports.intent_statically_validate);
  }

  public signedIntentHash(
    input: SignedIntentHashInput
  ): SignedIntentHashOutput {
    return this.callFunction(input, this.exports.signed_intent_hash);
  }

  public signedIntentCompile(
    input: SignedIntentCompileInput
  ): SignedIntentCompileOutput {
    return this.callFunction(input, this.exports.signed_intent_compile);
  }

  public signedIntentDecompile(
    input: SignedIntentDecompileInput
  ): SignedIntentDecompileOutput {
    return this.callFunction(input, this.exports.signed_intent_decompile);
  }

  public signedIntentStaticallyValidate(
    input: SignedIntentStaticallyValidateInput
  ): SignedIntentStaticallyValidateOutput {
    return this.callFunction(
      input,
      this.exports.signed_intent_statically_validate
    );
  }

  public notarizedTransactionHash(
    input: NotarizedTransactionHashInput
  ): NotarizedTransactionHashOutput {
    return this.callFunction(input, this.exports.notarized_transaction_hash);
  }

  public notarizedTransactionCompile(
    input: NotarizedTransactionCompileInput
  ): NotarizedTransactionCompileOutput {
    return this.callFunction(input, this.exports.notarized_transaction_compile);
  }

  public notarizedTransactionDecompile(
    input: NotarizedTransactionDecompileInput
  ): NotarizedTransactionDecompileOutput {
    return this.callFunction(
      input,
      this.exports.notarized_transaction_decompile
    );
  }

  public notarizedTransactionStaticallyValidate(
    input: NotarizedTransactionStaticallyValidateInput
  ): NotarizedTransactionStaticallyValidateOutput {
    return this.callFunction(
      input,
      this.exports.notarized_transaction_statically_validate
    );
  }

  public manifestSborDecodeToString(
    input: ManifestSborDecodeToStringInput
  ): ManifestSborDecodeToStringOutput {
    return this.callFunction(
      input,
      this.exports.manifest_sbor_decode_to_string
    );
  }

  public scryptoSborDecodeToString(
    input: ScryptoSborDecodeToStringInput
  ): ScryptoSborDecodeToStringOutput {
    return this.callFunction(input, this.exports.scrypto_sbor_decode_to_string);
  }

  public scryptoSborEncodeStringRepresentation(
    input: ScryptoSborEncodeStringRepresentationInput
  ): ScryptoSborEncodeStringRepresentationOutput {
    return this.callFunction(
      input,
      this.exports.scrypto_sbor_encode_string_representation
    );
  }

  public utilsKnownAddresses(
    input: UtilsKnownAddressesInput
  ): UtilsKnownAddressesOutput {
    return this.callFunction(input, this.exports.utils_known_addresses);
  }

  public addressEntityType(
    input: AddressEntityTypeInput
  ): AddressEntityTypeOutput {
    return this.callFunction(input, this.exports.address_entity_type);
  }

  public addressDecode(input: AddressDecodeInput): AddressDecodeOutput {
    return this.callFunction(input, this.exports.address_decode);
  }

  allocateMemory(capacity: number): number {
    return this.exports.toolkit_alloc(capacity);
  }

  deallocateMemory(pointer: number): void {
    this.exports.toolkit_free_c_string(pointer);
  }

  memory(): WebAssembly.Memory {
    return this.exports.memory;
  }

  /**
   * Calls a method on the Radix Engine Toolkit and returns the output from the function invocation.
   *
   * This function is an extension {@link Host<Exports>#callFunction} that adds support for detecting when a
   * function invocation has errored out and throwing an exception in this case with the error that
   * was returned.
   *
   * @param input The input of the Radix Engine Toolkit function.
   * @param fn The Radix Engine Toolkit function to invoke.
   * @returns An object of the generic type {@link O} of the expected output from the function.
   */
  public callFunction<O>(input: any, fn: (input: number) => number): O {
    const output = super.callFunction<O>(input, fn);
    if (this.isErrorResponse(output)) {
      const inputString = JSON.stringify(input);
      const outputString = JSON.stringify(output);
      throw new Error(
        `Radix Engine Toolkit error for invocation ${inputString} response is ${outputString}`
      );
    }
    return output;
  }

  /**
   * Determines if the output of the Radix Engine Toolkit is an error response or not. This is used
   * to determine if the Radix Engine Toolkit should throw an exception or not.
   * @param output The Radix Engine Toolkit output to check if it's an error or not.
   * @returns A boolean indicating whether this is an error response or not.
   */
  private isErrorResponse(output: any): boolean {
    const topLevelErrors = [
      "InvocationHandlingError",
      "InvocationInterpretationError",
    ];
    return output === undefined
      ? false
      : topLevelErrors.includes(output?.["kind"]);
  }
}

/**
 * An interface that defines the the structure of functions and memory exposed by the Radix Engine
 * Toolkit WASM module.
 */
interface Exports {
  memory: WebAssembly.Memory;

  /* Build Module */
  build_information(pointer: number): number;

  /* Derivation Module */
  derive_virtual_account_address_from_public_key(pointer: number): number;
  derive_virtual_identity_address_from_public_key(pointer: number): number;
  derive_virtual_account_address_from_olympia_account_address(
    pointer: number
  ): number;
  derive_resource_address_from_olympia_resource_address(
    pointer: number
  ): number;
  derive_public_key_from_olympia_account_address(pointer: number): number;
  derive_olympia_account_address_from_public_key(pointer: number): number;
  derive_node_address_from_public_key(pointer: number): number;
  derive_bech32m_transaction_identifier_from_intent_hash(
    pointer: number
  ): number;

  /* Execution Module */
  execution_analyze(pointer: number): number;

  /* Instructions Module */
  instructions_hash(pointer: number): number;
  instructions_convert(pointer: number): number;
  instructions_compile(pointer: number): number;
  instructions_decompile(pointer: number): number;
  instructions_extract_addresses(pointer: number): number;
  instructions_statically_validate(pointer: number): number;

  /* Manifest Module */
  manifest_hash(pointer: number): number;
  manifest_compile(pointer: number): number;
  manifest_decompile(pointer: number): number;
  manifest_statically_validate(pointer: number): number;

  /* Intent Module */
  intent_hash(pointer: number): number;
  intent_compile(pointer: number): number;
  intent_decompile(pointer: number): number;
  intent_statically_validate(pointer: number): number;

  /* Signed Intent Module */
  signed_intent_hash(pointer: number): number;
  signed_intent_compile(pointer: number): number;
  signed_intent_decompile(pointer: number): number;
  signed_intent_statically_validate(pointer: number): number;

  /* Notarized Transaction Module */
  notarized_transaction_hash(pointer: number): number;
  notarized_transaction_compile(pointer: number): number;
  notarized_transaction_decompile(pointer: number): number;
  notarized_transaction_statically_validate(pointer: number): number;

  /* SBOR Modules */
  manifest_sbor_decode_to_string(pointer: number): number;
  scrypto_sbor_decode_to_string(pointer: number): number;
  scrypto_sbor_encode_string_representation(pointer: number): number;

  /* Utils Module */
  utils_known_addresses(pointer: number): number;

  /* Address Module */
  address_entity_type(pointer: number): number;
  address_decode(pointer: number): number;

  /* Sys Functions */
  toolkit_alloc(capacity: number): number;
  toolkit_free_c_string(pointer: number): void;
}

export const rawRadixEngineToolkit: Promise<RawRadixEngineToolkit> = wasmModule(
  wasmBindgenImports
).then((instance) => {
  const exports = instance.instance.exports as unknown as Exports;
  return new RawRadixEngineToolkit(exports);
});
