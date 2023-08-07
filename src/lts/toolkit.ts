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

import { RadixEngineToolkit as DefaultRadixEngineToolkit, hash } from "..";
import { Curve, PublicKey } from "./cryptography";
import {
  CompilableIntent,
  NotarizedTransaction,
  SignedTransactionIntent,
  TransactionIntent,
} from "./transaction";

export abstract class RadixEngineToolkit {
  static Transaction = class {
    /**
     * Given a transaction intent of any type, this function compiles the transaction intent
     * returning a byte array of the compiled intent.
     * @param intent Any intent or transaction part that can be compiled.
     * @returns The compiled intent
     */
    static async compile(intent: CompilableIntent): Promise<Uint8Array> {
      return intent.compile();
    }

    /**
     * Compiles the `TransactionIntent` by calling the Radix Engine Toolkit and SBOR Encoding it.
     * @param transactionIntent The transaction intent to compile
     * @returns The compiled transaction intent
     */
    static async compileTransactionIntent(
      transactionIntent: TransactionIntent
    ): Promise<Uint8Array> {
      return transactionIntent.compile();
    }

    /**
     * Compiles the `SignedTransactionIntent` by calling the Radix Engine Toolkit and SBOR Encoding it.
     * @param signedTransactionIntent The signed transaction intent to compile
     * @returns The compiled signed transaction intent
     */
    static async compileSignedTransactionIntent(
      signedTransactionIntent: SignedTransactionIntent
    ): Promise<Uint8Array> {
      return signedTransactionIntent.compile();
    }

    /**
     * Compiles the `NotarizedTransaction` by calling the Radix Engine Toolkit and SBOR Encoding it.
     * @param notarizedTransactionIntent The signed transaction intent to compile
     * @returns The compiled signed transaction intent
     */
    static async compileNotarizedTransactionIntent(
      notarizedTransactionIntent: NotarizedTransaction
    ): Promise<Uint8Array> {
      return notarizedTransactionIntent.compile();
    }
  };

  static Derive = class {
    /**
     * Given a public key and network id, this function deterministically calculates the address of
     * the virtual account component address associated with the public key.
     * @param publicKey An Ecdsa Secp256k1 or EdDSA Ed25519 public key to derive the virtual account
     * address for.
     * @param networkId The network that the virtual account address is meant for. This will be used
     * for the Bech32m encoding of the address.
     * @returns The address of the virtual account as a string.
     */
    static async virtualAccountAddress(
      publicKey: PublicKey,
      networkId: number
    ): Promise<string> {
      return DefaultRadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
        {
          kind: convertCurve(publicKey.curve),
          publicKey: publicKey.bytes,
        },
        networkId
      );
    }

    /**
     * Given an Olympia account address, this function deterministically calculates the address of
     * the associated virtual account on a Babylon network of a given network id.
     * @param olympiaAddress The Olympia account address to derive the associated Babylon virtual
     * account address for.
     * @param networkId The **Babylon** network id to derive the Babylon account address for. This is
     * primarily used for the Bech32m encoding of addresses. This argument defaults to `1` which is
     * the network id of the Babylon mainnet
     * @returns An object containing all of the mapping information of the address
     */
    static async babylonAccountAddressFromOlympiaAccountAddress(
      olympiaAddress: string,
      networkId: number
    ): Promise<OlympiaToBabylonAddressMapping> {
      const address =
        await DefaultRadixEngineToolkit.Derive.virtualAccountAddressFromOlympiaAccountAddress(
          olympiaAddress,
          networkId
        );
      const publicKey =
        await DefaultRadixEngineToolkit.Derive.publicKeyFromOlympiaAccountAddress(
          olympiaAddress
        );

      return {
        publicKey: new PublicKey.Secp256k1(publicKey),
        babylonAccountAddress: address,
        olympiaAccountAddress: olympiaAddress,
      };
    }

    /**
     * Given an Olympia account address, this function deterministically calculates the address of
     * the associated virtual account on a Babylon network of a given network id.
     * @param olympiaResourceAddress The Olympia account address to derive the associated Babylon virtual
     * account address for.
     * @param networkId The **Babylon** network id to derive the Babylon account address for. This is
     * primarily used for the Bech32m encoding of addresses. This argument defaults to `1` which is
     * the network id of the Babylon mainnet
     * @returns An object containing all of the mapping information of the address
     */
    static async babylonResourceAddressFromOlympiaResourceAddress(
      olympiaResourceAddress: string,
      networkId: number
    ): Promise<string> {
      return DefaultRadixEngineToolkit.Derive.resourceAddressFromOlympiaResourceAddress(
        olympiaResourceAddress,
        networkId
      );
    }

    /**
     * Derives the addresses of a set of known entities on the specified network.
     * @param networkId The network id to ge the known entity addresses for.
     * @returns An object containing the entity addresses on the network with the specified id.
     */
    static async knownAddresses(networkId: number): Promise<AddressBook> {
      return DefaultRadixEngineToolkit.Utils.knownAddresses(networkId).then(
        (knownAddresses) => {
          return {
            packages: {
              faucet: knownAddresses.packageAddresses.faucetPackage,
              account: knownAddresses.packageAddresses.accountPackage,
            },
            components: {
              faucet: knownAddresses.componentAddresses.faucet,
            },
            resources: {
              xrdResource: knownAddresses.resourceAddresses.xrd,
              secp256k1Resource:
                knownAddresses.resourceAddresses.secp256k1SignatureVirtualBadge,
              ed25519Resource:
                knownAddresses.resourceAddresses.ed25519SignatureVirtualBadge,
              systemResource:
                knownAddresses.resourceAddresses.systemTransactionBadge,
              packageBadgeResource:
                knownAddresses.resourceAddresses
                  .packageOfDirectCallerVirtualBadge,
            },
          };
        }
      );
    }
  };

  static Utils = class {
    /**
     * This function hashes a given byte array of data through the hashing algorithm used by the
     * Radix Engine and Scrypto. The hashing algorithm adopted by the Radix stack is Blake2b with 32
     * byte digests.
     * @param data The data to hash
     * @returns The hash of the data
     */
    static hash(data: Uint8Array): Uint8Array {
      return hash(data);
    }
  };
}

export interface OlympiaToBabylonAddressMapping {
  /**
   * The underling public key encoded in the Olympia account address.
   */
  publicKey: PublicKey;

  /**
   * The Olympia account address associated with the given public key.
   */
  olympiaAccountAddress: string;

  /**
   * The Babylon account address associated with a given Olympia account address.
   */
  babylonAccountAddress: string;
}

export interface AddressBook {
  resources: {
    xrdResource: string;
    secp256k1Resource: string;
    ed25519Resource: string;
    systemResource: string;
    packageBadgeResource: string;
  };
  components: {
    faucet: string;
  };
  packages: {
    faucet: string;
    account: string;
  };
}

const convertCurve = (curve: Curve): "Secp256k1" | "Ed25519" => {
  switch (curve) {
    case Curve.Secp256k1:
      return "Secp256k1";
    case Curve.Ed25519:
      return "Ed25519";
  }
};
