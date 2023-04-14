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

import { describe, expect, it } from "vitest";
import {
  ActionTransactionBuilder,
  ManifestAstValue,
  ManifestBuilder,
  NetworkId,
  NotarizedTransaction,
  PrivateKey,
  ValidationConfig,
} from "../../src";

describe("Action Builder Tests", () => {
  it("Simple action builder manifest matches expected", async () => {
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
    let transaction: NotarizedTransaction = await ActionTransactionBuilder.new(
      10,
      20,
      242,
      account1,
      privateKey.publicKey()
    ).then((builder) => {
      return builder
        .fungibleResourceTransfer(account1, account2, resourceAddress1, 100)
        .notarize(privateKey);
    });

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

    // Assert
    expect(transaction.signedIntent.intent.manifest).toEqual(expectedManifest);
    expect(
      (
        await transaction.staticallyValidate(
          ValidationConfig.default(NetworkId.Simulator)
        )
      ).isValid
    ).toBeTruthy();
  });

  it("Simple action builder manifest aggregates withdraws as expected", async () => {
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
    let transaction: NotarizedTransaction = await ActionTransactionBuilder.new(
      10,
      20,
      242,
      account1,
      privateKey.publicKey()
    ).then((builder) => {
      return builder
        .fungibleResourceTransfer(account1, account2, resourceAddress1, 100)
        .fungibleResourceTransfer(account1, account3, resourceAddress1, 200)
        .notarize(privateKey);
    });

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
      .build();

    // Assert
    expect(transaction.signedIntent.intent.manifest).toEqual(expectedManifest);
    expect(
      (
        await transaction.staticallyValidate(
          ValidationConfig.default(NetworkId.Simulator)
        )
      ).isValid
    ).toBeTruthy();
  });

  it("Simple action builder manifest aggregates deposits as expected", async () => {
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
    let transaction: NotarizedTransaction = await ActionTransactionBuilder.new(
      10,
      20,
      242,
      account1,
      privateKey.publicKey()
    ).then((builder) => {
      return builder
        .fungibleResourceTransfer(account1, account2, resourceAddress1, 100)
        .fungibleResourceTransfer(account3, account2, resourceAddress1, 100)
        .notarize(privateKey);
    });

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
      .callMethod(
        new ManifestAstValue.Address(account3),
        new ManifestAstValue.String("withdraw"),
        [
          new ManifestAstValue.Address(resourceAddress1),
          new ManifestAstValue.Decimal(100),
        ]
      )
      .takeFromWorktopByAmount(
        new ManifestAstValue.Address(resourceAddress1),
        new ManifestAstValue.Decimal(200),
        (builder, bucket) => {
          return builder.callMethod(
            new ManifestAstValue.Address(account2),
            new ManifestAstValue.String("deposit"),
            [bucket]
          );
        }
      )
      .build();

    // Assert
    expect(transaction.signedIntent.intent.manifest).toEqual(expectedManifest);
    expect(
      (
        await transaction.staticallyValidate(
          ValidationConfig.default(NetworkId.Simulator)
        )
      ).isValid
    ).toBeTruthy();
  });
});
