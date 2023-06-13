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
  StaticallyValidateTransactionRequest,
  StaticallyValidateTransactionResponseInvalid,
  StaticallyValidateTransactionResponseValid,
  TransactionBuilder,
  TransactionHeader,
  ValidationConfig,
} from "../../src";
import {} from "../../src/utils";

describe("Statically Validate Transaction", () => {
  it("static validation succeeds", async () => {
    let response = await RawRadixEngineToolkit.staticallyValidateTransaction(
      new StaticallyValidateTransactionRequest(
        "4d2102210221022109070107f20a00020000000000000a10020000000000000a220000000000000022000120072103c32f9761dd3f961a3d12747e54db6b821bd022ef92b9ebf591bfe186885baa2101010900e1f505080000210220220110002020002022060001210120074101af8f9d8e94529600370aa46a285e54a4fdcb231ba0788646ec403b4eec4639bf6231590164c6514f9df7c78dba5924e13e0c625cf1ce8d76c7996c3fb31af1ef0001210120074101a9b5ae285055f7195d2d60099c42ea7b2b60dbe36e71ec52dc1665de57f4eba23a53bad977282029e2b5a549cd33de3fbb10983023a73d5fc92d27144653959900012101200741000e54aafd2b9f28d03875ad264ede827060baac5ac82bd47036e5aeb44365b2e8136d525e084098b3df278fdf9135ab69f1809ddfdad9a71b0a02bdd81bde606c01022007204cb5abf6ad79fbf5abbccafcc269d85cd2651ed4b885b5869f241aedf0a5ba292101200740bb0de50890160d05b23c926319727dbcd4ec258ba2c06d8490cbd3df45c6a2c172f6892b105a2a7f073bf09956600a8b8ea132c3a61be522bda48177d7e6870601022007207422b9887598068e32c4448a949adb290d0f4e35b9e01b0ee5f1a1e600fe26742101200740eb13f90a3afb5865767534153d111b3b8c4a111322e2bbc32c56c4d339c3254c50aaf0749d159ceca465db7d6a93be869ca08def07c5a498816d7c8cbf8962000102200720f381626e41e7027ea431bfe3009e94bdd25a746beec468948d6c3c7c5dc9a54b210120074037cb4ad6a41f5c00dec197d3d437a4b926853156dfcd6169f2aaebd89db42992149fff66b38f57792aba4c3b16497585a284981ff851abb91292665be8c97d00220001210120074101af8f9d8e94529600370aa46a285e54a4fdcb231ba0788646ec403b4eec4639bf6231590164c6514f9df7c78dba5924e13e0c625cf1ce8d76c7996c3fb31af1ef",
        ValidationConfig.default(0xf2)
      )
    );

    expect(
      response instanceof StaticallyValidateTransactionResponseInvalid
    ).toBeTruthy();
    expect(
      (response as StaticallyValidateTransactionResponseInvalid).error
    ).toEqual("SignatureValidationError(InvalidNotarySignature)");
  });

  it("transactions produced by transaction builder are valid", async () => {
    // Arrange
    let notaryPrivateKey = new PrivateKey.EddsaEd25519(
      "2342d54a97214bd669640acab5de23d6f44028f1232386d3f9d3a60a50d6f7b3"
    );

    let signatory1PrivateKey = new PrivateKey.EddsaEd25519(
      "4293dd008ada84274fd828dde7f6662cbe6f38e4a2718266f08e5006d5b3c283"
    );
    let signatory2PrivateKey = new PrivateKey.EcdsaSecp256k1(
      "f13c26917d52df6339ffa59c289bc4b6384a8b341413242a16272e7c168c72cc"
    );

    // Act
    let notarizedTransaction = (await TransactionBuilder.new())
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
    let compiledNotarizedTransaction = (
      await RawRadixEngineToolkit.compileNotarizedTransactionIntent(
        notarizedTransaction
      )
    ).compiledIntent;

    let validationResult = await (
      await RawRadixEngineToolkit
    ).staticallyValidateTransaction(
      new StaticallyValidateTransactionRequest(
        compiledNotarizedTransaction,
        ValidationConfig.default(1)
      )
    );

    // Assert
    expect(
      validationResult instanceof StaticallyValidateTransactionResponseValid
    ).toBeTruthy();
  });

  it("faucet transactions produced by transaction builder are valid", async () => {
    // Arrange
    let notaryPrivateKey = new PrivateKey.EddsaEd25519(
      "2342d54a97214bd669640acab5de23d6f44028f1232386d3f9d3a60a50d6f7b3"
    );

    let notarizedTransaction = await SimpleTransactionBuilder.freeXrdFromFaucet(
      {
        toAccount:
          "account_sim1c95lpadykhzwy6tv7ncwprda04v58yaxnafglv63dl6j797ky0g57v",
        networkId: 0xf2,
        validFromEpoch: 10,
      }
    );

    let validationResult = await (
      await RawRadixEngineToolkit
    ).staticallyValidateTransaction(
      new StaticallyValidateTransactionRequest(
        notarizedTransaction.toByteArray(),
        ValidationConfig.default(0xf2)
      )
    );

    // Assert
    expect(
      validationResult instanceof StaticallyValidateTransactionResponseValid
    ).toBeTruthy();
  });
});
