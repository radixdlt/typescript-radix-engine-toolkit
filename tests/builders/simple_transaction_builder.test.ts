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
      "account_sim1qjdkmaevmu7ggs3jyruuykx2u5c2z7mp6wjk5f5tpy6swx5788";
    let account2 =
      "account_sim1qj0vpwp3l3y8jhk6nqtdplx4wh6mpu8mhu6mep4pua3q8tn9us";

    let resourceAddress1 =
      "resource_sim1qyw4pk2ecwecslf55dznrv49xxndzffnmpcwjavn5y7qyr2l73";
    let resourceAddress2 =
      "resource_sim1qymzzch4zj3k3emvtx0hxw98e4zktx96z2ewtsrqjprslqfpu7";

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
      "account_sim1qjdkmaevmu7ggs3jyruuykx2u5c2z7mp6wjk5f5tpy6swx5788";
    let account2 =
      "account_sim1qj0vpwp3l3y8jhk6nqtdplx4wh6mpu8mhu6mep4pua3q8tn9us";
    let account3 =
      "account_sim1qjj40p52dnww68e594c3jq6h3s8xr75fgcnpvlwmypjqmqamld";

    let resourceAddress1 =
      "resource_sim1qyw4pk2ecwecslf55dznrv49xxndzffnmpcwjavn5y7qyr2l73";
    let resourceAddress2 =
      "resource_sim1qymzzch4zj3k3emvtx0hxw98e4zktx96z2ewtsrqjprslqfpu7";

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
      "account_sim1qjdkmaevmu7ggs3jyruuykx2u5c2z7mp6wjk5f5tpy6swx5788";
    let account2 =
      "account_sim1qj0vpwp3l3y8jhk6nqtdplx4wh6mpu8mhu6mep4pua3q8tn9us";

    let resourceAddress1 =
      "resource_sim1qyw4pk2ecwecslf55dznrv49xxndzffnmpcwjavn5y7qyr2l73";

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
      "account_sim1qjdkmaevmu7ggs3jyruuykx2u5c2z7mp6wjk5f5tpy6swx5788";
    let account2 =
      "account_sim1qj0vpwp3l3y8jhk6nqtdplx4wh6mpu8mhu6mep4pua3q8tn9us";

    let resourceAddress1 =
      "resource_sim1qyw4pk2ecwecslf55dznrv49xxndzffnmpcwjavn5y7qyr2l73";
    let resourceAddress2 =
      "resource_sim1qymzzch4zj3k3emvtx0hxw98e4zktx96z2ewtsrqjprslqfpu7";
    let account3 =
      "account_sim1qjj40p52dnww68e594c3jq6h3s8xr75fgcnpvlwmypjqmqamld";

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
      "account_sim1qjdkmaevmu7ggs3jyruuykx2u5c2z7mp6wjk5f5tpy6swx5788";

    // Act
    const notarizedTransaction =
      await SimpleTransactionBuilder.freeXrdFromFaucet({
        forAccount: account1,
        networkId: 0xf2,
        startEpoch: 10,
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
