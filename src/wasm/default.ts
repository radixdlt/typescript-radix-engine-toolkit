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

import { Convert } from "../convert";
import { GeneratedConverter } from "../generated";
import { BuildInformation, OlympiaNetwork, PublicKey } from "../models";
import { rawRadixEngineToolkit } from "./raw";

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
}
