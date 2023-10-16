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

import Decimal from "decimal.js";
import {
  CompilableIntent,
  CompiledNotarizedTransaction,
  Curve,
  EntityType,
  HasCompiledIntent,
  Instruction,
  Intent,
  LTSNotarizedTransaction,
  LTSSignedTransactionIntent,
  LTSTransactionIntent,
  ManifestAddress,
  ManifestBuilder,
  PrivateKey,
  PublicKey,
  RadixEngineToolkit,
  TransactionBuilder,
  TransactionSummary,
  castValue,
  decimal,
  destructManifestValueTuple,
  enumeration,
  generateRandomNonce,
  hash,
  isAccountDepositCallMethod,
  isAccountWithdrawCallMethod,
  isFreeXrdCallMethod,
  isLockFeeCallMethod,
} from "..";

export abstract class LTSRadixEngineToolkit {
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
      transactionIntent: LTSTransactionIntent
    ): Promise<Uint8Array> {
      return transactionIntent.compile();
    }

    /**
     * Compiles the `SignedTransactionIntent` by calling the Radix Engine Toolkit and SBOR Encoding it.
     * @param signedTransactionIntent The signed transaction intent to compile
     * @returns The compiled signed transaction intent
     */
    static async compileSignedTransactionIntent(
      signedTransactionIntent: LTSSignedTransactionIntent
    ): Promise<Uint8Array> {
      return signedTransactionIntent.compile();
    }

    /**
     * Compiles the `NotarizedTransaction` by calling the Radix Engine Toolkit and SBOR Encoding it.
     * @param notarizedTransactionIntent The signed transaction intent to compile
     * @returns The compiled signed transaction intent
     */
    static async compileNotarizedTransactionIntent(
      notarizedTransactionIntent: LTSNotarizedTransaction
    ): Promise<Uint8Array> {
      return notarizedTransactionIntent.compile();
    }

    /**
     * Decompiles and summarizes a compiled intent extracting information such as locked fees,
     * deposits, and withdrawals.
     * @param compiledIntent The compiled intent to produce a summary for. This function accepts any
     * object that we can extract the compiled intent from.
     * @returns A summary on the transaction of the various withdraws, deposits, and locked fees
     * that can be statically obtained from the manifest.
     *
     * @remarks
     * This function only works for manifests that perform simple transfers which were created
     * through the SimpleTransactionBuilder class and will not work for any other more complex
     * transactions since this information might not be available to obtain statically from the
     * manifest.
     */
    static async summarizeTransaction(
      transaction: HasCompiledIntent | Uint8Array
    ): Promise<TransactionSummary> {
      const transactionIntent = await resolveTransactionIntent(transaction);
      const instructions = await RadixEngineToolkit.Instructions.convert(
        transactionIntent.manifest.instructions,
        transactionIntent.header.networkId,
        "Parsed"
      ).then((instructions) => instructions.value as Instruction[]);

      const [faucetComponentAddress, xrdResourceAddress] =
        await RadixEngineToolkit.Utils.knownAddresses(
          transactionIntent.header.networkId
        ).then((knownAddresses) => [
          knownAddresses.componentAddresses.faucet,
          knownAddresses.resourceAddresses.xrd,
        ]);

      // A map where the key is the bucket ID and the value is a tuple of the resource address and
      // amount.
      const bucketAmounts: Record<string, [string, Decimal]> = {};

      // The bucket id to use for the next bucket allocation. This is similar to what the Scrypto id
      // allocator does.
      let bucketId = 0;

      let feesLocked: TransactionSummary["feesLocked"] | undefined = undefined;
      const withdraws: Record<string, Record<string, Decimal>> = {};
      const deposits: Record<string, Record<string, Decimal>> = {};

      for (const instruction of instructions) {
        switch (instruction.kind) {
          case "TakeFromWorktop":
            const resourceAddress = instruction.resourceAddress;
            const amount = instruction.amount;
            bucketAmounts[bucketId++] = [resourceAddress, amount];
            break;
          case "CallMethod":
            // Cases we support:
            // 1. Withdraw by amount
            // 2. Deposit by amount
            // 3. Lock fee
            // 4. Free XRD

            if (
              await isLockFeeCallMethod(instruction, faucetComponentAddress)
            ) {
              const [amountValue] = destructManifestValueTuple(
                instruction.args
              );
              feesLocked = {
                account: resolveManifestAddress(instruction.address).value,
                amount: castValue<"Decimal">(amountValue, "Decimal").value,
              };
            } else if (await isAccountWithdrawCallMethod(instruction)) {
              const [resourceAddressValue, amountValue] =
                destructManifestValueTuple(instruction.args);
              const accountAddress = resolveManifestAddress(
                instruction.address
              ).value;
              const resourceAddress = resolveManifestAddress(
                castValue<"Address">(resourceAddressValue, "Address").value
              ).value;
              const amount = castValue<"Decimal">(amountValue, "Decimal").value;

              withdraws[accountAddress] ??= {};
              withdraws[accountAddress][resourceAddress] ??= new Decimal("0");
              withdraws[accountAddress][resourceAddress] =
                withdraws[accountAddress][resourceAddress].add(amount);
            } else if (await isAccountDepositCallMethod(instruction)) {
              const [bucketValue] = destructManifestValueTuple(
                instruction.args
              );
              const accountAddress = resolveManifestAddress(
                instruction.address
              ).value;
              const bucket = castValue<"Bucket">(bucketValue, "Bucket").value;
              const [resourceAddress, amount] = bucketAmounts[bucket];

              deposits[accountAddress] ??= {};
              deposits[accountAddress][resourceAddress] ??= new Decimal("0");
              deposits[accountAddress][resourceAddress] =
                deposits[accountAddress][resourceAddress].add(amount);

              delete bucketAmounts[bucket];
            } else if (
              await isFreeXrdCallMethod(instruction, faucetComponentAddress)
            ) {
              withdraws[faucetComponentAddress] ??= {};
              withdraws[faucetComponentAddress][xrdResourceAddress] ??=
                new Decimal("0");
              withdraws[faucetComponentAddress][xrdResourceAddress] = withdraws[
                faucetComponentAddress
              ][xrdResourceAddress].add(new Decimal("10000"));
            } else {
              throw new Error(`Unsupported CallMethod: ${instruction}`);
            }
            break;
          case "TakeAllFromWorktop":
          case "TakeNonFungiblesFromWorktop":
          case "ReturnToWorktop":
          case "AssertWorktopContainsAny":
          case "AssertWorktopContains":
          case "AssertWorktopContainsNonFungibles":
          case "PopFromAuthZone":
          case "PushToAuthZone":
          case "DropAuthZoneProofs":
          case "CreateProofFromAuthZoneOfAmount":
          case "CreateProofFromAuthZoneOfNonFungibles":
          case "CreateProofFromAuthZoneOfAll":
          case "DropNamedProofs":
          case "DropAuthZoneRegularProofs":
          case "DropAuthZoneSignatureProofs":
          case "CreateProofFromBucketOfAmount":
          case "CreateProofFromBucketOfNonFungibles":
          case "CreateProofFromBucketOfAll":
          case "BurnResource":
          case "CloneProof":
          case "DropProof":
          case "CallFunction":
          case "CallRoyaltyMethod":
          case "CallMetadataMethod":
          case "CallRoleAssignmentMethod":
          case "CallDirectVaultMethod":
          case "DropAllProofs":
          case "AllocateGlobalAddress":
            throw new Error(
              `LTS resolution of resource movements does not support this instructions: ${instruction.kind}`
            );
        }
      }

      if (feesLocked !== undefined) {
        return {
          feesLocked,
          withdraws,
          deposits,
        };
      } else {
        throw new Error("No lock_fee instruction found in the manifest");
      }
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
      return RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
        publicKey,
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
        await RadixEngineToolkit.Derive.virtualAccountAddressFromOlympiaAccountAddress(
          olympiaAddress,
          networkId
        );
      const publicKey =
        await RadixEngineToolkit.Derive.publicKeyFromOlympiaAccountAddress(
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
      return RadixEngineToolkit.Derive.resourceAddressFromOlympiaResourceAddress(
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
      return RadixEngineToolkit.Utils.knownAddresses(networkId).then(
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

    static async bech32mTransactionIdentifierFromIntentHash(
      transactionHash: Uint8Array,
      networkId: number
    ): Promise<string> {
      return RadixEngineToolkit.Derive.bech32mTransactionIdentifierFromIntentHash(
        transactionHash,
        networkId
      );
    }
  };

  static Address = class {
    static async isGlobalAccount(address: string): Promise<boolean> {
      const entityType = await RadixEngineToolkit.Address.entityType(address);
      return (
        entityType == EntityType.GlobalVirtualEd25519Account ||
        entityType == EntityType.GlobalVirtualSecp256k1Account ||
        entityType == EntityType.GlobalAccount
      );
    }

    static async isFungibleResource(address: string): Promise<boolean> {
      const entityType = await RadixEngineToolkit.Address.entityType(address);
      return entityType == EntityType.GlobalFungibleResourceManager;
    }

    static async isNonFungibleResource(address: string): Promise<boolean> {
      const entityType = await RadixEngineToolkit.Address.entityType(address);
      return entityType == EntityType.GlobalNonFungibleResourceManager;
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

  /**
   * A sub-API of the toolkit that includes contains utility functions used for testing.
   */
  static TestUtils = class {
    /**
     * Creates a new account that has a default deposit rule of disallowing resource deposits. The
     * created account is a virtual account derived from the public key of a pseudo-random private
     * key. Thus, this function should only be used for testing.
     * @param currentEpoch The current epoch of the network that this transaction will be submitted
     * to.
     * @param networkId The id of the network that this transaction is constructed for.
     * @returns An object containing the address of the soon-to-be-created account with deposits
     * disabled and the compiled notarized transaction to submit the ledger to create the account.
     */
    static async createAccountWithDisabledDeposits(
      currentEpoch: number,
      networkId: number
    ): Promise<{
      accountAddress: string;
      compiledNotarizedTransaction: CompiledNotarizedTransaction;
    }> {
      // NOTE: The following ephemeral key is intentionally NOT generated through a secure random
      // number generator since in this case there are no risks associated with this.
      // The following are the reasons we do not see this as a security risk:
      //
      // * The transaction constructed here is to create an account with 0 funds and with the
      //   deposits disabled for the purposes of TESTING and only testing.
      // * The key used here is only used to notarize the transaction. It's not being used to create
      //   a key to an account that would store actual funds.
      // * The worst that can happen is that an attacker who could guess the private key can cancel
      //   the faucet transaction (a feature which is not even implemented in Scrypto yet).
      //
      // Generating the following key through a secure random number generator requires the use of
      // CryptoJS which is a library that's tough to get working with different versions of NodeJS,
      // in different environments, and with different module systems. Thus, the choice was made not
      // to make use of it.
      //
      // WARNING: DO NOT USE THE FOLLOWING CODE TO GENERATE YOUR OWN PRIVATE KEYS. THIS FUNCTION IS
      //          ONLY USED FOR TESTING.
      const ephemeralPrivateKey = new PrivateKey.Ed25519(
        new Uint8Array(Array(32).map((_) => Math.floor(Math.random() * 0xff)))
      );
      const ephemeralPublicKey = ephemeralPrivateKey.publicKey();
      const virtualAccount =
        await LTSRadixEngineToolkit.Derive.virtualAccountAddress(
          ephemeralPublicKey,
          networkId
        );
      const faucetComponentAddress =
        await LTSRadixEngineToolkit.Derive.knownAddresses(networkId).then(
          (addresses) => addresses.components.faucet
        );

      const manifest = new ManifestBuilder()
        .callMethod(faucetComponentAddress, "lock_fee", [decimal("10")])
        .callMethod(virtualAccount, "set_default_deposit_rule", [
          enumeration(1),
        ])
        .build();
      const notarizedTransaction = await TransactionBuilder.new().then(
        (builder) =>
          builder
            .header({
              networkId: networkId,
              startEpochInclusive: currentEpoch,
              endEpochExclusive: currentEpoch + 10,
              nonce: generateRandomNonce(),
              notaryPublicKey: ephemeralPublicKey,
              notaryIsSignatory: true,
              tipPercentage: 0,
            })
            .manifest(manifest)
            .notarize(ephemeralPrivateKey)
      );

      const compiledNotarizedTransaction = new CompiledNotarizedTransaction(
        await RadixEngineToolkit.Intent.hash(
          notarizedTransaction.signedIntent.intent
        ),
        await RadixEngineToolkit.NotarizedTransaction.compile(
          notarizedTransaction
        ),
        await RadixEngineToolkit.NotarizedTransaction.hash(notarizedTransaction)
      );

      return {
        accountAddress: virtualAccount,
        compiledNotarizedTransaction,
      };
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
    case "Secp256k1":
      return "Secp256k1";
    case "Ed25519":
      return "Ed25519";
  }
};

const resolveManifestAddress = (
  address: ManifestAddress
): Extract<ManifestAddress, { kind: "Static" }> => {
  if (address.kind == "Static") {
    return address;
  } else {
    throw new Error("Not a static address");
  }
};

const resolveTransactionIntent = (
  intent: HasCompiledIntent | Uint8Array
): Promise<Intent> => {
  if (intent.constructor === Uint8Array) {
    return resolveUnknownCompiledIntent(intent);
  } else {
    return (intent as HasCompiledIntent)
      .compiledIntent()
      .then(RadixEngineToolkit.Intent.decompile);
  }
};

const resolveUnknownCompiledIntent = (intent: Uint8Array): Promise<Intent> => {
  return RadixEngineToolkit.Intent.decompile(intent).catch(() => {
    return RadixEngineToolkit.SignedIntent.decompile(intent)
      .then((signedIntent) => signedIntent.intent)
      .catch(() => {
        return RadixEngineToolkit.NotarizedTransaction.decompile(intent).then(
          (transaction) => transaction.signedIntent.intent
        );
      });
  });
};
