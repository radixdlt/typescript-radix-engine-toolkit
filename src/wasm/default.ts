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

import {
  BuildInformation,
  Convert,
  EntityType,
  ExecutionAnalysis,
  Instructions,
  Intent,
  KnownAddresses,
  ManifestSborStringRepresentation,
  NotarizedTransaction,
  OlympiaNetwork,
  PublicKey,
  SerializationMode,
  SignedIntent,
  StaticValidationResult,
  TransactionHash,
  TransactionManifest,
  ValidationConfig,
  rawRadixEngineToolkit,
} from "../";
import {
  GeneratedConverter,
  InstructionsStaticallyValidateOutput,
  IntentStaticallyValidateOutput,
  ManifestStaticallyValidateOutput,
  NotarizedTransactionStaticallyValidateOutput,
  SerializableInstructionsKind,
  SignedIntentStaticallyValidateOutput,
} from "../generated";

export class RadixEngineToolkit {
  /* Build Module */

  /**
   * A module of the Radix Engine Toolkit which exposes information relating to the build of the
   * toolkit in use.
   */
  static Build = class {
    /**
     * Returns information on the core Radix Engine Toolkit WASM such as it's version and the
     * version of the Scrypto dependency in it.
     * @returns Information on the version of the Radix Engine Toolkit's WASM and information on the
     * Scrypto dependency that was used to build the toolkit.
     */
    static async information(): Promise<BuildInformation> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.buildInformation({});
      return {
        version: output.version,
        scryptoDependency: output.scrypto_dependency,
      };
    }
  };

  /**
   * A module of the Radix Engine Toolkit concerned with performing derivations.
   */
  static Derive = class {
    /**
     * Derives the virtual account address associated with the provided public key on the given
     * network.
     * @param publicKey The public key to derive virtual account address for.
     * @param networkId The id of the network that this address is to be used for. This is an 8-bit
     * unsigned integer in the range [0x00, 0xFF]
     * @returns A string of the bech32m encoded address of the virtual account address derived from
     * the public key.
     */
    static async virtualAccountAddressFromPublicKey(
      publicKey: PublicKey,
      networkId: number
    ): Promise<string> {
      const rawRet = await rawRadixEngineToolkit;
      const input = {
        network_id: Convert.Number.toString(networkId),
        public_key: GeneratedConverter.PublicKey.toGenerated(publicKey),
      };
      const output = rawRet.deriveVirtualAccountAddressFromPublicKey(input);
      return output;
    }

    /**
     * Derives the virtual identity address associated with the provided public key on the given
     * network.
     * @param publicKey The public key to derive virtual identity address for.
     * @param networkId The id of the network that this address is to be used for. This is an 8-bit
     * unsigned integer in the range [0x00, 0xFF]
     * @returns A string of the bech32m encoded address of the virtual identity address derived from
     * the public key.
     */
    static async virtualIdentityAddressFromPublicKey(
      publicKey: PublicKey,
      networkId: number
    ): Promise<string> {
      const rawRet = await rawRadixEngineToolkit;
      const input = {
        network_id: Convert.Number.toString(networkId),
        public_key: GeneratedConverter.PublicKey.toGenerated(publicKey),
      };
      const output = rawRet.deriveVirtualIdentityAddressFromPublicKey(input);
      return output;
    }

    /**
     * Derives the address of the account on the Babylon network associated with an account on the
     * Olympia network.
     * @param olympiaAccountAddress The address of the account on the Olympia network.
     * @param networkId The id of the network that this address is to be used for. This is an 8-bit
     * unsigned integer in the range [0x00, 0xFF].
     * @returns A string of the bech32m encoded address of the virtual account address derived from
     * the olympia account address.
     */
    static async virtualAccountAddressFromOlympiaAccountAddress(
      olympiaAccountAddress: string,
      networkId: number
    ): Promise<string> {
      const rawRet = await rawRadixEngineToolkit;
      const output =
        rawRet.deriveVirtualAccountAddressFromOlympiaAccountAddress({
          olympia_account_address: olympiaAccountAddress,
          network_id: Convert.Number.toString(networkId),
        });
      return output;
    }

    /**
     * Derives the resource address on the Babylon network associated with a resource from the
     * Olympia network.
     * @param olympiaResourceAddress The address of the resource on the Olympia network.
     * @param networkId The id of the network that this address is to be used for. This is an 8-bit
     * unsigned integer in the range [0x00, 0xFF].
     * @returns A string of the bech32m encoded address of the resource address on the Babylon
     * network derived from the resource address form the Olympia network.
     */
    static async resourceAddressFromOlympiaResourceAddress(
      olympiaResourceAddress: string,
      networkId: number
    ): Promise<string> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.deriveResourceAddressFromOlympiaResourceAddress({
        network_id: Convert.Number.toString(networkId),
        olympia_resource_address: olympiaResourceAddress,
      });
      return output;
    }

    /**
     * Derives the public key of an Olympia account.
     * @param olympiaAccountAddress The address of the account on the Olympia network.
     * @returns A byte array of the Ecdsa Secp256k1 public key associated with the Olympia account.
     */
    static async publicKeyFromOlympiaAccountAddress(
      olympiaAccountAddress: string
    ): Promise<Uint8Array> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.derivePublicKeyFromOlympiaAccountAddress(
        olympiaAccountAddress
      );
      return Convert.HexString.toUint8Array(output);
    }

    /**
     * Derives the Olympia account address associated with a public key.
     * @param publicKey The Ecdsa Secp256k1 public key to derive the Olympia account address for.
     * @param olympiaNetwork The Olympia network to derive the account address for.
     * @returns The derived Olympia account address.
     */
    static async olympiaAccountAddressFromPublicKey(
      publicKey: Uint8Array,
      olympiaNetwork: OlympiaNetwork
    ): Promise<string> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.deriveOlympiaAccountAddressFromPublicKey({
        olympia_network:
          GeneratedConverter.OlympiaNetwork.toGenerated(olympiaNetwork),
        public_key: Convert.Uint8Array.toHexString(publicKey),
      });
      return output;
    }

    /**
     * Derives the node address from an Ecdsa Secp256k1 public key.
     * @param publicKey The Ecdsa Secp256k1 public key to derive the node address for.
     * @param networkId The network id of the node.
     * @returns The derived node address.
     */
    static async nodeAddressFromPublicKey(
      publicKey: Uint8Array,
      networkId: number
    ): Promise<string> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.deriveNodeAddressFromPublicKey({
        network_id: Convert.Number.toString(networkId),
        public_key: Convert.Uint8Array.toHexString(publicKey),
      });
      return output;
    }
  };

  /**
   * A module of the Radix Engine Toolkit concerned with functions that can be applied to
   * instructions.
   */
  static Instructions = class {
    /**
     * Converts {@link Instructions} from one format to another. Currently, the supported formats
     * are `String` and `Parsed`.
     * @param instructions The instructions the format should be changed for.
     * @param networkId The id of the network that the instructions are meant for.
     * @param instructionsKind The kind of instructions to get out.
     * @returns The converted instructions.
     */
    static async convert(
      instructions: Instructions,
      networkId: number,
      instructionsKind: "String" | "Parsed"
    ): Promise<Instructions> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.instructionsConvert({
        instructions: GeneratedConverter.Instructions.toGenerated(instructions),
        network_id: Convert.Number.toString(networkId),
        instructions_kind: SerializableInstructionsKind[instructionsKind],
      });
      return GeneratedConverter.Instructions.fromGenerated(output);
    }

    static async compile(
      instructions: Instructions,
      networkId: number
    ): Promise<Uint8Array> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.instructionsCompile({
        instructions: GeneratedConverter.Instructions.toGenerated(instructions),
        network_id: Convert.Number.toString(networkId),
      });
      return Convert.HexString.toUint8Array(output);
    }

    static async decompile(
      compiledInstructions: Uint8Array,
      networkId: number,
      instructionsKind: "String" | "Parsed" = "Parsed"
    ): Promise<Instructions> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.instructionsDecompile({
        compiled: Convert.Uint8Array.toHexString(compiledInstructions),
        network_id: Convert.Number.toString(networkId),
        instructions_kind: SerializableInstructionsKind[instructionsKind],
      });
      return GeneratedConverter.Instructions.fromGenerated(output);
    }

    static async extractAddresses(
      instructions: Instructions,
      networkId: number
    ): Promise<Record<EntityType, string[]>> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.instructionsExtractAddresses({
        instructions: GeneratedConverter.Instructions.toGenerated(instructions),
        network_id: Convert.Number.toString(networkId),
      });
      return output.addresses;
    }

    static async staticallyValidate(
      instructions: Instructions,
      networkId: number
    ): Promise<StaticValidationResult> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.instructionsStaticallyValidate({
        instructions: GeneratedConverter.Instructions.toGenerated(instructions),
        network_id: Convert.Number.toString(networkId),
      });
      return toStaticValidationResult(output);
    }
  };

  static TransactionManifest = class {
    static async compile(
      transactionManifest: TransactionManifest,
      networkId: number
    ): Promise<Uint8Array> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.manifestCompile({
        manifest:
          GeneratedConverter.TransactionManifest.toGenerated(
            transactionManifest
          ),
        network_id: Convert.Number.toString(networkId),
      });
      return Convert.HexString.toUint8Array(output);
    }

    static async decompile(
      compiledTransactionManifest: Uint8Array,
      networkId: number,
      instructionsKind: "String" | "Parsed" = "Parsed"
    ): Promise<TransactionManifest> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.manifestDecompile({
        compiled: Convert.Uint8Array.toHexString(compiledTransactionManifest),
        network_id: Convert.Number.toString(networkId),
        instructions_kind: SerializableInstructionsKind[instructionsKind],
      });
      return GeneratedConverter.TransactionManifest.fromGenerated(output);
    }

    static async staticallyValidate(
      transactionManifest: TransactionManifest,
      networkId: number
    ): Promise<StaticValidationResult> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.manifestStaticallyValidate({
        manifest:
          GeneratedConverter.TransactionManifest.toGenerated(
            transactionManifest
          ),
        network_id: Convert.Number.toString(networkId),
      });
      return toStaticValidationResult(output);
    }
  };

  static Intent = class {
    static async intentHash(intent: Intent): Promise<TransactionHash> {
      return this.hash(intent);
    }

    static async hash(intent: Intent): Promise<TransactionHash> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.intentHash(
        GeneratedConverter.Intent.toGenerated(intent)
      );
      return GeneratedConverter.TransactionHash.fromGenerated(output);
    }

    static async compile(intent: Intent): Promise<Uint8Array> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.intentCompile(
        GeneratedConverter.Intent.toGenerated(intent)
      );
      return Convert.HexString.toUint8Array(output);
    }

    static async decompile(
      compiledIntent: Uint8Array,
      instructionsKind: "String" | "Parsed" = "Parsed"
    ): Promise<Intent> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.intentDecompile({
        compiled: Convert.Uint8Array.toHexString(compiledIntent),
        instructions_kind: SerializableInstructionsKind[instructionsKind],
      });
      return GeneratedConverter.Intent.fromGenerated(output);
    }

    static async staticallyValidate(
      intent: Intent,
      validationConfig: ValidationConfig
    ): Promise<StaticValidationResult> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.intentStaticallyValidate({
        intent: GeneratedConverter.Intent.toGenerated(intent),
        validation_config:
          GeneratedConverter.ValidationConfig.toGenerated(validationConfig),
      });
      return toStaticValidationResult(output);
    }
  };

  static SignedIntent = class {
    static async hash(signedIntent: SignedIntent): Promise<TransactionHash> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.signedIntentHash(
        GeneratedConverter.SignedIntent.toGenerated(signedIntent)
      );
      return GeneratedConverter.TransactionHash.fromGenerated(output);
    }

    static async signedIntentHash(
      signedIntent: SignedIntent
    ): Promise<TransactionHash> {
      return this.hash(signedIntent);
    }

    static async intentHash(
      signedIntent: SignedIntent
    ): Promise<TransactionHash> {
      return RadixEngineToolkit.Intent.hash(signedIntent.intent);
    }

    static async compile(signedIntent: SignedIntent): Promise<Uint8Array> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.signedIntentCompile(
        GeneratedConverter.SignedIntent.toGenerated(signedIntent)
      );
      return Convert.HexString.toUint8Array(output);
    }

    static async decompile(
      compiledSignedIntent: Uint8Array,
      instructionsKind: "String" | "Parsed" = "Parsed"
    ): Promise<SignedIntent> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.signedIntentDecompile({
        compiled: Convert.Uint8Array.toHexString(compiledSignedIntent),
        instructions_kind: SerializableInstructionsKind[instructionsKind],
      });
      return GeneratedConverter.SignedIntent.fromGenerated(output);
    }

    static async staticallyValidate(
      signedIntent: SignedIntent,
      validationConfig: ValidationConfig
    ): Promise<StaticValidationResult> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.signedIntentStaticallyValidate({
        signed_intent:
          GeneratedConverter.SignedIntent.toGenerated(signedIntent),
        validation_config:
          GeneratedConverter.ValidationConfig.toGenerated(validationConfig),
      });
      return toStaticValidationResult(output);
    }
  };

  static NotarizedTransaction = class {
    static async hash(
      notarizedTransaction: NotarizedTransaction
    ): Promise<TransactionHash> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.notarizedTransactionHash(
        GeneratedConverter.NotarizedTransaction.toGenerated(
          notarizedTransaction
        )
      );
      return GeneratedConverter.TransactionHash.fromGenerated(output);
    }

    static async notarizedTransactionHash(
      notarizedTransaction: NotarizedTransaction
    ): Promise<TransactionHash> {
      return this.hash(notarizedTransaction);
    }

    static async signedIntentHash(
      notarizedTransaction: NotarizedTransaction
    ): Promise<TransactionHash> {
      return RadixEngineToolkit.SignedIntent.hash(
        notarizedTransaction.signedIntent
      );
    }

    static async intentHash(
      notarizedTransaction: NotarizedTransaction
    ): Promise<TransactionHash> {
      return RadixEngineToolkit.Intent.hash(
        notarizedTransaction.signedIntent.intent
      );
    }

    static async compile(
      notarizedTransaction: NotarizedTransaction
    ): Promise<Uint8Array> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.notarizedTransactionCompile(
        GeneratedConverter.NotarizedTransaction.toGenerated(
          notarizedTransaction
        )
      );
      return Convert.HexString.toUint8Array(output);
    }

    static async decompile(
      compiledNotarizedTransaction: Uint8Array,
      instructionsKind: "String" | "Parsed" = "Parsed"
    ): Promise<NotarizedTransaction> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.notarizedTransactionDecompile({
        compiled: Convert.Uint8Array.toHexString(compiledNotarizedTransaction),
        instructions_kind: SerializableInstructionsKind[instructionsKind],
      });
      return GeneratedConverter.NotarizedTransaction.fromGenerated(output);
    }

    static async staticallyValidate(
      notarizedTransaction: NotarizedTransaction,
      validationConfig: ValidationConfig
    ): Promise<StaticValidationResult> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.notarizedTransactionStaticallyValidate({
        notarized_transaction:
          GeneratedConverter.NotarizedTransaction.toGenerated(
            notarizedTransaction
          ),
        validation_config:
          GeneratedConverter.ValidationConfig.toGenerated(validationConfig),
      });
      return toStaticValidationResult(output);
    }
  };

  static Execution = class {
    static async analyze(
      instructions: Instructions,
      receipt: Uint8Array,
      networkId: number
    ): Promise<ExecutionAnalysis> {
      const rawRet = await rawRadixEngineToolkit;
      const output = await rawRet.executionAnalyze({
        instructions: GeneratedConverter.Instructions.toGenerated(instructions),
        network_id: Convert.Number.toString(networkId),
        preview_receipt: Convert.Uint8Array.toHexString(receipt),
      });
      return GeneratedConverter.ExecutionAnalysis.fromGenerated(output);
    }
  };

  static ManifestSbor = class {
    static async decodeToString(
      payload: Uint8Array,
      networkId: number,
      representation: ManifestSborStringRepresentation
    ): Promise<string> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.manifestSborDecodeToString({
        encoded_payload: Convert.Uint8Array.toHexString(payload),
        network_id: Convert.Number.toString(networkId),
        representation:
          GeneratedConverter.ManifestSborStringRepresentation.toGenerated(
            representation
          ),
      });
      return output;
    }
  };

  static ScryptoSbor = class {
    static async decodeToString(
      payload: Uint8Array,
      networkId: number,
      representation: SerializationMode
    ): Promise<string> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.scryptoSborDecodeToString({
        encoded_payload: Convert.Uint8Array.toHexString(payload),
        network_id: Convert.Number.toString(networkId),
        representation:
          GeneratedConverter.SerializationMode.toGenerated(representation),
      });
      return output;
    }

    static async encodeProgrammaticJson(object: any): Promise<Uint8Array> {
      const encoded = JSON.stringify(object);
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.scryptoSborEncodeStringRepresentation({
        kind: "ProgrammaticJson",
        value: encoded,
      });
      return Convert.HexString.toUint8Array(output);
    }
  };

  static Address = class {
    static async entityType(address: string): Promise<EntityType> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.addressEntityType(address);
      return GeneratedConverter.EntityType.fromGenerated(output);
    }

    static async decode(address: string): Promise<{
      networkId: number;
      entityType: EntityType;
      hrp: String;
      data: Uint8Array;
    }> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.addressDecode(address);
      return {
        networkId: Convert.String.toNumber(output.network_id),
        entityType: GeneratedConverter.EntityType.fromGenerated(
          output.entity_type
        ),
        hrp: output.hrp,
        data: Convert.HexString.toUint8Array(output.data),
      };
    }
  };

  static Utils = class {
    static async knownAddresses(networkId: number): Promise<KnownAddresses> {
      const rawRet = await rawRadixEngineToolkit;
      const output = rawRet.utilsKnownAddresses(
        Convert.Number.toString(networkId)
      );
      return {
        resourceAddresses: {
          xrd: output.resource_addresses.xrd,
          secp256k1SignatureVirtualBadge:
            output.resource_addresses.secp256k1_signature_virtual_badge,
          ed25519SignatureVirtualBadge:
            output.resource_addresses.ed25519_signature_virtual_badge,
          packageOfDirectCallerVirtualBadge:
            output.resource_addresses.package_of_direct_caller_virtual_badge,
          globalCallerVirtualBadge:
            output.resource_addresses.global_caller_virtual_badge,
          systemTransactionBadge:
            output.resource_addresses.system_transaction_badge,
          packageOwnerBadge: output.resource_addresses.package_owner_badge,
          validatorOwnerBadge: output.resource_addresses.validator_owner_badge,
          accountOwnerBadge: output.resource_addresses.account_owner_badge,
          identityOwnerBadge: output.resource_addresses.identity_owner_badge,
        },
        packageAddresses: {
          packagePackage: output.package_addresses.package_package,
          resourcePackage: output.package_addresses.resource_package,
          accountPackage: output.package_addresses.account_package,
          identityPackage: output.package_addresses.identity_package,
          consensusManagerPackage:
            output.package_addresses.consensus_manager_package,
          accessControllerPackage:
            output.package_addresses.access_controller_package,
          poolPackage: output.package_addresses.pool_package,
          transactionProcessorPackage:
            output.package_addresses.transaction_processor_package,
          metadataModulePackage:
            output.package_addresses.metadata_module_package,
          royaltyModulePackage: output.package_addresses.royalty_module_package,
          roleAssignmentModulePackage:
            output.package_addresses.role_assignment_module_package,
          genesisHelperPackage: output.package_addresses.genesis_helper_package,
          faucetPackage: output.package_addresses.faucet_package,
        },
        componentAddresses: {
          consensusManager: output.component_addresses.consensus_manager,
          genesisHelper: output.component_addresses.genesis_helper,
          faucet: output.component_addresses.faucet,
        },
      };
    }
  };
}

const toStaticValidationResult = (
  input:
    | InstructionsStaticallyValidateOutput
    | ManifestStaticallyValidateOutput
    | IntentStaticallyValidateOutput
    | SignedIntentStaticallyValidateOutput
    | NotarizedTransactionStaticallyValidateOutput
): StaticValidationResult => {
  switch (input.kind) {
    case "Valid":
      return {
        kind: "Valid",
      };
    case "Invalid":
      return {
        kind: "Invalid",
        error: input.value,
      };
  }
};
