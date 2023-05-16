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
  InstructionList,
  ManifestAstValue,
  ManifestBuilder,
  NetworkId,
  PrivateKey,
  RadixEngineToolkit,
  SimpleTransactionBuilder,
} from "../../src";
import {
  LTSRadixEngineToolkit,
  TransactionSummary,
} from "../../src/wrapper/lts";

describe("SimpleTransactionBuilder Tests", () => {
  it("Simple transaction builder manifest matches expected", async () => {
    // Arrange
    let privateKey = new PrivateKey.EddsaEd25519(
      "d52618de62aa37a9fdac229614ca931d9e509e00cd01ff9f465e5dba5e17be8b"
    );

    let account1 =
      "account_sim1c8vgq8vk50vjtu7xqmg23cxy02pwepdnpkkgecxum5552e9nq7an47";
    let account2 =
      "account_sim1cy0vpwuud0shkqjh83w2rjrq8q2gdc9lnuq8gpwcmemn5l6mp8s3cg";

    let resourceAddress1 =
      "resource_sim1thl0ly2vj88x4pl5nezlpu9jry565d032x2aepl9z8u3hf5r0hlntq";
    let resourceAddress2 =
      "resource_sim1th8c3mcq3nahd7k2urjc0e7ak93jhxqdlw5q85ql9sjl09085mepzq";

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
      .compileIntent()
      .compileNotarized(privateKey);

    // Assert
    (
      await transaction.staticallyValidate(NetworkId.Simulator)
    ).throwIfInvalid();
    const decompiledNotarizedTransaction =
      await RadixEngineToolkit.decompileNotarizedTransactionIntent(
        transaction.compiled,
        InstructionList.Kind.Parsed
      );

    let expectedManifest = new ManifestBuilder()
      .callMethod(account1, "lock_fee", [new ManifestAstValue.Decimal("5")])
      .callMethod(
        new ManifestAstValue.Address(account1),
        new ManifestAstValue.String("withdraw"),
        [
          new ManifestAstValue.Address(resourceAddress1),
          new ManifestAstValue.Decimal(100),
        ]
      )
      .takeFromWorktopByAmount(
        new ManifestAstValue.Address(resourceAddress1),
        new ManifestAstValue.Decimal(100),
        (builder, bucket) => {
          return builder.callMethod(
            new ManifestAstValue.Address(account2),
            new ManifestAstValue.String("deposit"),
            [bucket]
          );
        }
      )
      .build();

    expect(decompiledNotarizedTransaction.signedIntent.intent.manifest).toEqual(
      expectedManifest
    );
  });

  it("Simple transaction builder manifest aggregates withdraws as expected", async () => {
    // Arrange
    let privateKey = new PrivateKey.EddsaEd25519(
      "d52618de62aa37a9fdac229614ca931d9e509e00cd01ff9f465e5dba5e17be8b"
    );

    let account1 =
      "account_sim1c8vgq8vk50vjtu7xqmg23cxy02pwepdnpkkgecxum5552e9nq7an47";
    let account2 =
      "account_sim1cy0vpwuud0shkqjh83w2rjrq8q2gdc9lnuq8gpwcmemn5l6mp8s3cg";
    let account3 =
      "account_sim1cys6csq3fych50s9wuh78y36q7e2j9pkn8f8wntf7zp727w3dutt45";

    let resourceAddress1 =
      "resource_sim1thl0ly2vj88x4pl5nezlpu9jry565d032x2aepl9z8u3hf5r0hlntq";
    let resourceAddress2 =
      "resource_sim1t555v3tetksc9f2k7a0ssjj6taad6sxkxaurjht2lu8x577e4mvkxe";

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
        toAccount: account3,
        resourceAddress: resourceAddress1,
        amount: 200,
      })
      .transferFungible({
        toAccount: account3,
        resourceAddress: resourceAddress2,
        amount: 5,
      })
      .compileIntent()
      .compileNotarized(privateKey);

    // Assert
    (
      await transaction.staticallyValidate(NetworkId.Simulator)
    ).throwIfInvalid();
    const decompiledNotarizedTransaction =
      await RadixEngineToolkit.decompileNotarizedTransactionIntent(
        transaction.compiled,
        InstructionList.Kind.Parsed
      );

    let expectedManifest = new ManifestBuilder()
      .callMethod(account1, "lock_fee", [new ManifestAstValue.Decimal("5")])
      .callMethod(
        new ManifestAstValue.Address(account1),
        new ManifestAstValue.String("withdraw"),
        [
          new ManifestAstValue.Address(resourceAddress1),
          new ManifestAstValue.Decimal(300),
        ]
      )
      .callMethod(
        new ManifestAstValue.Address(account1),
        new ManifestAstValue.String("withdraw"),
        [
          new ManifestAstValue.Address(resourceAddress2),
          new ManifestAstValue.Decimal(5),
        ]
      )
      .takeFromWorktopByAmount(
        new ManifestAstValue.Address(resourceAddress1),
        new ManifestAstValue.Decimal(100),
        (builder, bucket) => {
          return builder.callMethod(
            new ManifestAstValue.Address(account2),
            new ManifestAstValue.String("deposit"),
            [bucket]
          );
        }
      )
      .takeFromWorktopByAmount(
        new ManifestAstValue.Address(resourceAddress1),
        new ManifestAstValue.Decimal(200),
        (builder, bucket) => {
          return builder.callMethod(
            new ManifestAstValue.Address(account3),
            new ManifestAstValue.String("deposit"),
            [bucket]
          );
        }
      )
      .takeFromWorktopByAmount(
        new ManifestAstValue.Address(resourceAddress2),
        new ManifestAstValue.Decimal(5),
        (builder, bucket) => {
          return builder.callMethod(
            new ManifestAstValue.Address(account3),
            new ManifestAstValue.String("deposit"),
            [bucket]
          );
        }
      )
      .build();
    expect(decompiledNotarizedTransaction.signedIntent.intent.manifest).toEqual(
      expectedManifest
    );
  });

  it("Simple transaction builder manifest aggregates deposits as expected", async () => {
    // Arrange
    let privateKey = new PrivateKey.EddsaEd25519(
      "d52618de62aa37a9fdac229614ca931d9e509e00cd01ff9f465e5dba5e17be8b"
    );

    let account1 =
      "account_sim1c8vgq8vk50vjtu7xqmg23cxy02pwepdnpkkgecxum5552e9nq7an47";
    let account2 =
      "account_sim1cy0vpwuud0shkqjh83w2rjrq8q2gdc9lnuq8gpwcmemn5l6mp8s3cg";

    let resourceAddress1 =
      "resource_sim1thl0ly2vj88x4pl5nezlpu9jry565d032x2aepl9z8u3hf5r0hlntq";

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
      .compileIntent()
      .compileNotarized(privateKey);

    // Assert
    (
      await transaction.staticallyValidate(NetworkId.Simulator)
    ).throwIfInvalid();
    const decompiledNotarizedTransaction =
      await RadixEngineToolkit.decompileNotarizedTransactionIntent(
        transaction.compiled,
        InstructionList.Kind.Parsed
      );

    let expectedManifest = new ManifestBuilder()
      .callMethod(account1, "lock_fee", [new ManifestAstValue.Decimal("5")])
      .callMethod(
        new ManifestAstValue.Address(account1),
        new ManifestAstValue.String("withdraw"),
        [
          new ManifestAstValue.Address(resourceAddress1),
          new ManifestAstValue.Decimal(300),
        ]
      )
      .takeFromWorktopByAmount(
        new ManifestAstValue.Address(resourceAddress1),
        new ManifestAstValue.Decimal(300),
        (builder, bucket) => {
          return builder.callMethod(
            new ManifestAstValue.Address(account2),
            new ManifestAstValue.String("deposit"),
            [bucket]
          );
        }
      )
      .build();

    expect(decompiledNotarizedTransaction.signedIntent.intent.manifest).toEqual(
      expectedManifest
    );
  });

  it("Simple transaction builder manifests are summarized as expected", async () => {
    // Arrange
    let privateKey = new PrivateKey.EddsaEd25519(
      "d52618de62aa37a9fdac229614ca931d9e509e00cd01ff9f465e5dba5e17be8b"
    );

    let account1 =
      "account_sim1c8vgq8vk50vjtu7xqmg23cxy02pwepdnpkkgecxum5552e9nq7an47";
    let account2 =
      "account_sim1cy0vpwuud0shkqjh83w2rjrq8q2gdc9lnuq8gpwcmemn5l6mp8s3cg";

    let resourceAddress1 =
      "resource_sim1thl0ly2vj88x4pl5nezlpu9jry565d032x2aepl9z8u3hf5r0hlntq";
    let resourceAddress2 =
      "resource_sim1th8c3mcq3nahd7k2urjc0e7ak93jhxqdlw5q85ql9sjl09085mepzq";
    let account3 =
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
    let expectedSummary: TransactionSummary = {
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
    let transactionSummary =
      await LTSRadixEngineToolkit.Transaction.summarizeTransaction(transaction);

    expect(transactionSummary).toEqual(expectedSummary);
  });

  it("Simple transaction builder free XRD transactions are summarized as expected", async () => {
    // Arrange
    let account1 =
      "account_sim1c8vgq8vk50vjtu7xqmg23cxy02pwepdnpkkgecxum5552e9nq7an47";

    // Act
    const notarizedTransaction =
      await SimpleTransactionBuilder.freeXrdFromFaucet({
        toAccount: account1,
        networkId: 0xf2,
        validFromEpoch: 10,
      });

    // Assert
    let [faucetComponentAddress, xrdResourceAddress] =
      await RadixEngineToolkit.knownEntityAddresses(0xf2).then((x) => [
        x.faucetComponentAddress,
        x.xrdResourceAddress,
      ]);
    let expectedSummary: TransactionSummary = {
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

    let transactionSummary =
      await LTSRadixEngineToolkit.Transaction.summarizeTransaction(
        notarizedTransaction
      );

    expect(transactionSummary).toEqual(expectedSummary);
  });
});
