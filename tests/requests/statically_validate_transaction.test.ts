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
  ManifestBuilder,
  PrivateKey,
  RawRadixEngineToolkit,
  SimpleTransactionBuilder,
  StaticallyValidateTransactionInput,
  StaticallyValidateTransactionOutputValid,
  TransactionBuilder,
  TransactionHeader,
  ValidationConfig,
} from "../../src";
import {} from "../../src/utils";

describe("Statically Validate Transaction", () => {
  it("transactions produced by transaction builder are valid", async () => {
    // Arrange
    const notaryPrivateKey = new PrivateKey.EddsaEd25519(
      "2342d54a97214bd669640acab5de23d6f44028f1232386d3f9d3a60a50d6f7b3"
    );

    const signatory1PrivateKey = new PrivateKey.EddsaEd25519(
      "4293dd008ada84274fd828dde7f6662cbe6f38e4a2718266f08e5006d5b3c283"
    );
    const signatory2PrivateKey = new PrivateKey.EcdsaSecp256k1(
      "f13c26917d52df6339ffa59c289bc4b6384a8b341413242a16272e7c168c72cc"
    );

    // Act
    const notarizedTransaction = (await TransactionBuilder.new())
      .header(
        new TransactionHeader(
          1,
          100,
          105,
          5144,
          notaryPrivateKey.publicKey(),
          false,
          12
        )
      )
      .manifest(new ManifestBuilder().dropAllProofs().build())
      .sign(signatory1PrivateKey)
      .sign(signatory2PrivateKey)
      .notarize(notaryPrivateKey);
    const compiledNotarizedTransaction = (
      await RawRadixEngineToolkit.compileNotarizedTransactionIntent(
        notarizedTransaction
      )
    ).compiledIntent;

    const validationResult = await (
      await RawRadixEngineToolkit
    ).staticallyValidateTransaction(
      new StaticallyValidateTransactionInput(
        compiledNotarizedTransaction,
        ValidationConfig.default(1)
      )
    );

    // Assert
    expect(
      validationResult instanceof StaticallyValidateTransactionOutputValid
    ).toBeTruthy();
  });

  it("faucet transactions produced by transaction builder are valid", async () => {
    // Arrange
    const notaryPrivateKey = new PrivateKey.EddsaEd25519(
      "2342d54a97214bd669640acab5de23d6f44028f1232386d3f9d3a60a50d6f7b3"
    );

    const notarizedTransaction =
      await SimpleTransactionBuilder.freeXrdFromFaucet({
        toAccount:
          "account_sim1c95lpadykhzwy6tv7ncwprda04v58yaxnafglv63dl6j797ky0g57v",
        networkId: 0xf2,
        validFromEpoch: 10,
      });

    const validationResult = await (
      await RawRadixEngineToolkit
    ).staticallyValidateTransaction(
      new StaticallyValidateTransactionInput(
        notarizedTransaction.toByteArray(),
        ValidationConfig.default(0xf2)
      )
    );

    // Assert
    expect(
      validationResult instanceof StaticallyValidateTransactionOutputValid
    ).toBeTruthy();
  });
});
