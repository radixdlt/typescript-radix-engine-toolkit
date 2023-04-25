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
        "4d2102210221022109070107f20a00020000000000000a10020000000000000a220000000000000022000120072103c32f9761dd3f961a3d12747e54db6b821bd022ef92b9ebf591bfe186885baa2101010900e1f5050800002102202209210380048944f6ce22315a26c4b90c6e7e09a093dcbc98c89e67d32b2dc10c087769746864726177210280010000000000000000000000000000000000000000000000000000850000f444829163450000000000000000000000000000000000000000000000000102850000c84e676dc11b00000000000000000000000000000000000000000000000080010000000000000000000000000000000000000000000000000000210380034ed96f21d83d7303bdb2ca3fc6f6c6691504d5540f9bd41b07ed0c0b6275795f67756d62616c6c2101810000000005028500002cf61a24a229000000000000000000000000000000000000000000000000800100000000000000000000000000000000000000000000000000000401800289ba4758731898e0850fbde5d412c080e4f8b7ea03174cb180d900018001000000000000000000000000000000000000000000000000000003018101000000020220870101000000000000000180010000000000000000000000000000000000000000000000000000210380048944f6ce22315a26c4b90c6e7e09a093dcbc98c89e67d32b2dc10c0d6465706f7369745f62617463682101830020200020220600012101200741001dc81ce1fd9b1de438972231e81db2cab2ec01f205019c7e947b2ef049c18763283394f18f7efd1ede7122a5b0ae68bcab671c6f28a83061c13c1b7413728a7400012101200741008b86278af6e6336c8e7a3d635f0fec9c467588397c4df4818f32e897238f2a3c1edb19118c9d9a09f9c2f98506486e96db89acc987a5b3dee4861e01ca8761d0000121012007410075a6696b28b00b4295ffdfeaf852e52736f8fbd2314e1ea087ce0215b799cba14a98d918be28cf71ed51eaa58d7b88e1a15ef50297e04ec97dbad77d7702784e01022007204cb5abf6ad79fbf5abbccafcc269d85cd2651ed4b885b5869f241aedf0a5ba2921012007402a310d3ed1eacc1ccf3b7d59a91a6474415c647f55af42e2e912dc850b79f7418108a1bed1ee34103530372b1899853fff078c32b5e590bb718f74a1df32400a01022007207422b9887598068e32c4448a949adb290d0f4e35b9e01b0ee5f1a1e600fe267421012007407eb1c121969dfba6cf43695a12f889e15081407ea455396cb02acdc101b277618531cb9a231ec48798c02c0bb73f9350f0e58bda6b6c8b6b5d6416ecd1f218010102200720f381626e41e7027ea431bfe3009e94bdd25a746beec468948d6c3c7c5dc9a54b2101200740c2277b73ff69e7e63b1c5ec98b23f71d7e419df1c69d5e58d4a73a9bdb18192b72f64410c7e19e7b88fd339112c8171928ae3669f39cad38050eb48a8ecb3c0d2200012101200741001dc81ce1fd9b1de438972231e81db2cab2ec01f205019c7e947b2ef049c18763283394f18f7efd1ede7122a5b0ae68bcab671c6f28a83061c13c1b7413728a74",
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
          1,
          100,
          105,
          5144,
          notaryPrivateKey.publicKey(),
          false,
          100000000,
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
    let notarizedTransaction = await SimpleTransactionBuilder.freeXrdFromFaucet(
      {
        forAccount:
          "account_sim1q3cztnp4h232hsfmu0j63f7f7mz5wxhd0n0hqax6smjqznhzrp",
        networkId: 0xf2,
        startEpoch: 10,
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
