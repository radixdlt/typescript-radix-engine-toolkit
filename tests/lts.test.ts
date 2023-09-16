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
import { describe, expect, it } from "vitest";
import {
  Convert,
  LTSRadixEngineToolkit,
  NetworkId,
  PrivateKey,
  RadixEngineToolkit,
  SimpleTransactionBuilder,
  TransactionSummary,
} from "../src";

describe("Address Class", () => {
  it("account components are picked up by the toolkit", async () => {
    // Arrange
    const privateKey = new PrivateKey.Secp256k1(
      "3b840a679a9728ef0d844fd1a8c963482ecacc8328f2a0de0184954abe04aba1"
    );
    const publicKey = privateKey.publicKey();
    const virtualAccountAddress =
      await LTSRadixEngineToolkit.Derive.virtualAccountAddress(
        publicKey,
        NetworkId.Mainnet
      );

    // Act
    const isAccountAddress =
      await LTSRadixEngineToolkit.Address.isGlobalAccount(
        virtualAccountAddress
      );

    // Assert
    expect(isAccountAddress).toBeTruthy();
  });

  it("fungible resource addresses are picked up by the toolkit", async () => {
    // Arrange
    const knownAddresses = await LTSRadixEngineToolkit.Derive.knownAddresses(
      NetworkId.RCNetV1
    );
    const xrdResourceAddress = knownAddresses.resources.xrdResource;

    // Act
    let isResourceAddress =
      await LTSRadixEngineToolkit.Address.isFungibleResource(
        xrdResourceAddress
      );

    // Assert
    expect(isResourceAddress).toBeTruthy();
  });

  it("non-fungible resource addresses are picked up by the toolkit", async () => {
    // Arrange
    const knownAddresses = await LTSRadixEngineToolkit.Derive.knownAddresses(
      NetworkId.RCNetV1
    );
    const xrdResourceAddress = knownAddresses.resources.secp256k1Resource;

    // Act
    let isResourceAddress =
      await LTSRadixEngineToolkit.Address.isNonFungibleResource(
        xrdResourceAddress
      );

    // Assert
    expect(isResourceAddress).toBeTruthy();
  });

  it("Address of an Olympia resource can be derived for Babylon", async () => {
    // Arrange
    const olympiaResourceAddress =
      "fix_tr1qdaj7qea3xz8gup5lgaw8duwwwc3z60w9vrnr7p0xr4q98vkk6";
    const expectedBabylonResourceAddress =
      "resource_rdx1thm77tew8uzxfykjr56x94yu3n8s87rjap55zxrtn4wc3k9lez3kl2";

    // Act
    const babylonResourceAddress =
      await LTSRadixEngineToolkit.Derive.babylonResourceAddressFromOlympiaResourceAddress(
        olympiaResourceAddress,
        NetworkId.Mainnet
      );

    // Assert
    expect(babylonResourceAddress).toEqual(expectedBabylonResourceAddress);
  });

  it("Address of XRD on Olympia resource can be derived for Babylon", async () => {
    // Arrange
    const olympiaResourceAddress = "xrd_tr1qyf0x76s";
    const expectedBabylonResourceAddress =
      "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd";

    // Act
    const babylonResourceAddress =
      await LTSRadixEngineToolkit.Derive.babylonResourceAddressFromOlympiaResourceAddress(
        olympiaResourceAddress,
        NetworkId.Mainnet
      );

    // Assert
    expect(babylonResourceAddress).toEqual(expectedBabylonResourceAddress);
  });

  it("Simple transaction builder manifests are summarized as expected", async () => {
    // Arrange
    const privateKey = new PrivateKey.Ed25519(
      "d52618de62aa37a9fdac229614ca931d9e509e00cd01ff9f465e5dba5e17be8b"
    );

    const account1 =
      "account_sim1c8vgq8vk50vjtu7xqmg23cxy02pwepdnpkkgecxum5552e9nq7an47";
    const account2 =
      "account_sim1cy0vpwuud0shkqjh83w2rjrq8q2gdc9lnuq8gpwcmemn5l6mp8s3cg";

    const resourceAddress1 =
      "resource_sim1thl0ly2vj88x4pl5nezlpu9jry565d032x2aepl9z8u3hf5r0hlntq";
    const resourceAddress2 =
      "resource_sim1th8c3mcq3nahd7k2urjc0e7ak93jhxqdlw5q85ql9sjl09085mepzq";
    const account3 =
      "account_sim1cys6csq3fych50s9wuh78y36q7e2j9pkn8f8wntf7zp727w3dutt45";

    // Act
    const builder = await SimpleTransactionBuilder.new({
      networkId: NetworkId.Simulator,
      validFromEpoch: 10,
      fromAccount: account1,
      signerPublicKey: privateKey.publicKey(),
    });
    const transaction = builder
      .transferFungible({
        toAccount: account2,
        resourceAddress: resourceAddress1,
        amount: 100,
      })
      .transferFungible({
        toAccount: account2,
        resourceAddress: resourceAddress1,
        amount: 200,
      })
      .transferFungible({
        toAccount: account2,
        resourceAddress: resourceAddress2,
        amount: 500,
      })
      .transferFungible({
        toAccount: account3,
        resourceAddress: resourceAddress1,
        amount: 5,
      })
      .compileIntent()
      .compileNotarized(privateKey);

    // Assert
    const expectedSummary: TransactionSummary = {
      feesLocked: {
        account: account1,
        amount: new Decimal("5"),
      },
      withdraws: {
        [account1]: {
          [resourceAddress1]: new Decimal("305"),
          [resourceAddress2]: new Decimal("500"),
        },
      },
      deposits: {
        [account2]: {
          [resourceAddress1]: new Decimal("300"),
          [resourceAddress2]: new Decimal("500"),
        },
        [account3]: {
          [resourceAddress1]: new Decimal("5"),
        },
      },
    };
    const transactionSummary =
      await LTSRadixEngineToolkit.Transaction.summarizeTransaction(transaction);

    expect(JSON.stringify(transactionSummary)).toStrictEqual(
      JSON.stringify(expectedSummary)
    );
  });

  it("Simple transaction builder free XRD transactions are summarized as expected", async () => {
    // Arrange
    const account1 =
      "account_sim1c8vgq8vk50vjtu7xqmg23cxy02pwepdnpkkgecxum5552e9nq7an47";

    // Act
    const notarizedTransaction =
      await SimpleTransactionBuilder.freeXrdFromFaucet({
        toAccount: account1,
        networkId: 0xf2,
        validFromEpoch: 10,
      });

    // Assert
    const [faucetComponentAddress, xrdResourceAddress] =
      await RadixEngineToolkit.Utils.knownAddresses(0xf2).then((x) => [
        x.componentAddresses.faucet,
        x.resourceAddresses.xrd,
      ]);
    const expectedSummary: TransactionSummary = {
      feesLocked: {
        account: faucetComponentAddress,
        amount: new Decimal("10"),
      },
      withdraws: {
        [faucetComponentAddress]: {
          [xrdResourceAddress]: new Decimal("10000"),
        },
      },
      deposits: {
        [account1]: {
          [xrdResourceAddress]: new Decimal("10000"),
        },
      },
    };

    const transactionSummary =
      await LTSRadixEngineToolkit.Transaction.summarizeTransaction(
        notarizedTransaction
      );

    expect(JSON.stringify(transactionSummary)).toStrictEqual(
      JSON.stringify(expectedSummary)
    );
  });

  it("Simple transaction builder free XRD are statically valid", async () => {
    // Arrange
    const account1 =
      "account_sim1c8vgq8vk50vjtu7xqmg23cxy02pwepdnpkkgecxum5552e9nq7an47";

    // Act
    const notarizedTransaction =
      await SimpleTransactionBuilder.freeXrdFromFaucet({
        toAccount: account1,
        networkId: 0xf2,
        validFromEpoch: 10,
      });

    // Assert
    const instructions = await notarizedTransaction
      .compiledIntent()
      .then((compiledIntent) =>
        RadixEngineToolkit.Intent.decompile(compiledIntent)
      )
      .then((intent) => intent.manifest.instructions);
    const validity = await RadixEngineToolkit.Instructions.staticallyValidate(
      instructions,
      0xf2
    );

    expect(validity.kind).toStrictEqual("Valid");
  });

  it("Simple transaction builder manifests are statically valid", async () => {
    // Arrange
    const privateKey = new PrivateKey.Ed25519(
      "d52618de62aa37a9fdac229614ca931d9e509e00cd01ff9f465e5dba5e17be8b"
    );

    const account1 =
      "account_sim1c8vgq8vk50vjtu7xqmg23cxy02pwepdnpkkgecxum5552e9nq7an47";
    const account2 =
      "account_sim1cy0vpwuud0shkqjh83w2rjrq8q2gdc9lnuq8gpwcmemn5l6mp8s3cg";

    const resourceAddress1 =
      "resource_sim1thl0ly2vj88x4pl5nezlpu9jry565d032x2aepl9z8u3hf5r0hlntq";
    const resourceAddress2 =
      "resource_sim1th8c3mcq3nahd7k2urjc0e7ak93jhxqdlw5q85ql9sjl09085mepzq";
    const account3 =
      "account_sim1cys6csq3fych50s9wuh78y36q7e2j9pkn8f8wntf7zp727w3dutt45";

    // Act
    const builder = await SimpleTransactionBuilder.new({
      networkId: NetworkId.Simulator,
      validFromEpoch: 10,
      fromAccount: account1,
      signerPublicKey: privateKey.publicKey(),
    });
    const transaction = builder
      .transferFungible({
        toAccount: account2,
        resourceAddress: resourceAddress1,
        amount: 100,
      })
      .transferFungible({
        toAccount: account2,
        resourceAddress: resourceAddress1,
        amount: 200,
      })
      .transferFungible({
        toAccount: account2,
        resourceAddress: resourceAddress2,
        amount: 500,
      })
      .transferFungible({
        toAccount: account3,
        resourceAddress: resourceAddress1,
        amount: 5,
      })
      .compileIntent()
      .compileNotarized(privateKey);

    // Assert
    const instructions = await transaction
      .compiledIntent()
      .then((compiledIntent) =>
        RadixEngineToolkit.Intent.decompile(compiledIntent)
      )
      .then((intent) => intent.manifest.instructions);
    const validity = await RadixEngineToolkit.Instructions.staticallyValidate(
      instructions,
      0xf2
    );

    expect(validity.kind).toStrictEqual("Valid");
  });

  it("LTS TestUtils creation of disabled deposit account works.", async () => {
    const { accountAddress, compiledNotarizedTransaction } =
      await LTSRadixEngineToolkit.TestUtils.createAccountWithDisabledDeposits(
        5702,
        0x0d
      );

    compiledNotarizedTransaction
      .staticallyValidate(0x0d)
      .then((x) => x.throwIfInvalid());
  });

  it("Compiled untyped intent can be summarized by the LTS toolkit", async () => {
    // Arrange
    const transactionHex =
      "4d220302210221042107070e0a87060000000000000a8906000000000000095f6121312201012007201a5608e86828ea54a3a8c0c7107ebdc7050c1b162a6b7fd2760451a91c04691301010800002022044103800051176a3e1f0bf9684d7aa082ead1e30aa7c93dc2803d717bb08006fd5fcb0c086c6f636b5f6665652101850000e8890423c78a000000000000000000000000000000004103800051176a3e1f0bf9684d7aa082ead1e30aa7c93dc2803d717bb08006fd5fcb0c087769746864726177210280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c685000010632d5ec76b05000000000000000000000000000000000280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c685000010632d5ec76b050000000000000000000000000000004103800051fa22aed309225db4af4bd7b6e1ce1db415f852cb7505f96394cf7adfff0c147472795f6465706f7369745f6f725f61626f7274210281000000002200002020002200002022002201012101200740bf99117633deea71bf2e7a3a704d2f7eb7c5a2edaf1edfd254e4d8a246a973715b763a5df83e1e539b2b9bb0b20b376da5a91db73f87b8cce45f9e25a4858d02";
    const transactionBytes = Convert.HexString.toUint8Array(transactionHex);

    // Act & Assert
    const summarized =
      await LTSRadixEngineToolkit.Transaction.summarizeTransaction(
        transactionBytes
      );
  });
});
