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
  ManifestBuilder,
  NetworkId,
  PrivateKey,
  PublicKey,
  RadixEngineToolkit,
  SimpleTransactionBuilder,
  TransactionBuilder,
  TransactionHeader,
  TransactionSummary,
  defaultValidationConfig,
} from "../src";

describe("Transaction Builder & Simple Transaction Builder Tests", () => {
  it("A private key can be used as a signer.", async () => {
    // Arrange
    const notaryPrivateKey = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58e"
    );
    const privateKey = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58d"
    );
    const manifest = new ManifestBuilder().dropAllProofs().build();
    const header: TransactionHeader = {
      networkId: NetworkId.Simulator,
      startEpochInclusive: 0x00,
      endEpochExclusive: 0x10,
      nonce: 0x00,
      notaryPublicKey: notaryPrivateKey.publicKey(),
      notaryIsSignatory: true,
      tipPercentage: 0x00,
    };

    // Act
    const transaction = await TransactionBuilder.new().then((builder) =>
      builder
        .header(header)
        .manifest(manifest)
        .sign(privateKey)
        .notarize(notaryPrivateKey)
    );

    // Assert
    const staticValidity =
      await RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
        transaction,
        defaultValidationConfig(NetworkId.Simulator)
      );
    expect(staticValidity.kind).toBe("Valid");
    expect(transaction.signedIntent.intentSignatures.length).toBe(1);
  });

  it("A lone signature can be used as an intent signature.", async () => {
    // Arrange
    const notaryPrivateKey = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58e"
    );
    const privateKey = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58d"
    );
    const manifest = new ManifestBuilder().dropAllProofs().build();
    const header: TransactionHeader = {
      networkId: NetworkId.Simulator,
      startEpochInclusive: 0x00,
      endEpochExclusive: 0x10,
      nonce: 0x00,
      notaryPublicKey: notaryPrivateKey.publicKey(),
      notaryIsSignatory: true,
      tipPercentage: 0x00,
    };

    // Act
    const intentSignature = await RadixEngineToolkit.Intent.hash({
      manifest,
      header,
      message: { kind: "None" },
    })
      .then(({ hash }) => hash)
      .then((hash) => privateKey.signToSignatureWithPublicKey(hash));
    const transaction = await TransactionBuilder.new().then((builder) =>
      builder
        .header(header)
        .manifest(manifest)
        .sign(intentSignature)
        .notarize(notaryPrivateKey)
    );

    // Assert
    const staticValidity =
      await RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
        transaction,
        defaultValidationConfig(NetworkId.Simulator)
      );
    expect(staticValidity.kind).toBe("Valid");
    expect(transaction.signedIntent.intentSignatures.length).toBe(1);
  });

  it("A signature can be provided using a sync signature function.", async () => {
    // Arrange
    const notaryPrivateKey = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58e"
    );
    const privateKey = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58d"
    );
    const manifest = new ManifestBuilder().dropAllProofs().build();
    const header: TransactionHeader = {
      networkId: NetworkId.Simulator,
      startEpochInclusive: 0x00,
      endEpochExclusive: 0x10,
      nonce: 0x00,
      notaryPublicKey: notaryPrivateKey.publicKey(),
      notaryIsSignatory: true,
      tipPercentage: 0x00,
    };

    // Act
    const transaction = await TransactionBuilder.new().then((builder) =>
      builder
        .header(header)
        .manifest(manifest)
        .sign((intentHash: Uint8Array) =>
          privateKey.signToSignatureWithPublicKey(intentHash)
        )
        .notarize(notaryPrivateKey)
    );

    // Assert
    const staticValidity =
      await RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
        transaction,
        defaultValidationConfig(NetworkId.Simulator)
      );
    expect(staticValidity.kind).toBe("Valid");
    expect(transaction.signedIntent.intentSignatures.length).toBe(1);
  });

  it("A signature can be provided using an async signature function.", async () => {
    // Arrange
    const notaryPrivateKey = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58e"
    );
    const privateKey = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58d"
    );
    const manifest = new ManifestBuilder().dropAllProofs().build();
    const header: TransactionHeader = {
      networkId: NetworkId.Simulator,
      startEpochInclusive: 0x00,
      endEpochExclusive: 0x10,
      nonce: 0x00,
      notaryPublicKey: notaryPrivateKey.publicKey(),
      notaryIsSignatory: true,
      tipPercentage: 0x00,
    };

    // Act
    const transaction = await TransactionBuilder.new().then((builder) =>
      builder
        .header(header)
        .manifest(manifest)
        .signAsync((intentHash: Uint8Array) =>
          Promise.resolve(privateKey.signToSignatureWithPublicKey(intentHash))
        )
        .notarize(notaryPrivateKey)
    );

    // Assert
    const staticValidity =
      await RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
        transaction,
        defaultValidationConfig(NetworkId.Simulator)
      );
    expect(staticValidity.kind).toBe("Valid");
    expect(transaction.signedIntent.intentSignatures.length).toBe(1);
  });

  it("A signature can be provided through all of the means.", async () => {
    // Arrange
    const notaryPrivateKey = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58e"
    );
    const privateKey1 = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58d"
    );
    const privateKey2 = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58a"
    );
    const privateKey3 = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58b"
    );
    const privateKey4 = new PrivateKey.Secp256k1(
      "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58c"
    );
    const manifest = new ManifestBuilder().dropAllProofs().build();
    const header: TransactionHeader = {
      networkId: NetworkId.Simulator,
      startEpochInclusive: 0x00,
      endEpochExclusive: 0x10,
      nonce: 0x00,
      notaryPublicKey: notaryPrivateKey.publicKey(),
      notaryIsSignatory: true,
      tipPercentage: 0x00,
    };

    // Act
    const intentSignature = await RadixEngineToolkit.Intent.hash({
      manifest,
      header,
      message: { kind: "None" },
    })
      .then(({ hash }) => hash)
      .then((hash) => privateKey2.signToSignatureWithPublicKey(hash));
    const transaction = await TransactionBuilder.new().then((builder) =>
      builder
        .header(header)
        .manifest(manifest)
        .sign(privateKey1)
        .sign(intentSignature)
        .sign((intentHash: Uint8Array) =>
          privateKey3.signToSignatureWithPublicKey(intentHash)
        )
        .signAsync((intentHash: Uint8Array) =>
          Promise.resolve(privateKey4.signToSignatureWithPublicKey(intentHash))
        )
        .notarize(notaryPrivateKey)
    );

    // Assert
    const staticValidity =
      await RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
        transaction,
        defaultValidationConfig(NetworkId.Simulator)
      );
    expect(staticValidity.kind).toBe("Valid");
    expect(transaction.signedIntent.intentSignatures.length).toBe(4);
  });

  it("Simple transactions with private key notary are valid.", async () => {
    // Arrange
    const {
      privateKey: notaryPrivateKey,
      publicKey: notaryPublicKey,
      account: notaryAccount,
    } = await newAccount(1);
    const { account } = await newAccount(2);
    const xrd = await LTSRadixEngineToolkit.Derive.knownAddresses(
      NetworkId.Simulator
    ).then((addressBook) => addressBook.resources.xrdResource);

    // Act
    const transaction = await SimpleTransactionBuilder.new({
      networkId: NetworkId.Simulator,
      validFromEpoch: 2,
      fromAccount: notaryAccount,
      signerPublicKey: notaryPublicKey,
    }).then((builder) =>
      builder
        .lockedFee(10)
        .transferFungible({
          amount: 100,
          resourceAddress: xrd,
          toAccount: account,
        })
        .compileIntent()
        .compileNotarized(notaryPrivateKey)
    );

    // Assert
    transaction
      .staticallyValidate(NetworkId.Simulator)
      .then((validity) => validity.throwIfInvalid());
  });

  it("Simple transactions with signature function notary are valid.", async () => {
    // Arrange
    const {
      privateKey: notaryPrivateKey,
      publicKey: notaryPublicKey,
      account: notaryAccount,
    } = await newAccount(1);
    const { account } = await newAccount(2);
    const xrd = await LTSRadixEngineToolkit.Derive.knownAddresses(
      NetworkId.Simulator
    ).then((addressBook) => addressBook.resources.xrdResource);

    // Act
    const transaction = await SimpleTransactionBuilder.new({
      networkId: NetworkId.Simulator,
      validFromEpoch: 2,
      fromAccount: notaryAccount,
      signerPublicKey: notaryPublicKey,
    }).then((builder) =>
      builder
        .lockedFee(10)
        .transferFungible({
          amount: 100,
          resourceAddress: xrd,
          toAccount: account,
        })
        .compileIntent()
        .compileNotarized((signedIntentHash: Uint8Array) =>
          notaryPrivateKey.signToSignature(signedIntentHash)
        )
    );

    // Assert
    transaction
      .staticallyValidate(NetworkId.Simulator)
      .then((validity) => validity.throwIfInvalid());
  });

  it("Simple transactions with signature function notary are valid.", async () => {
    // Arrange
    const {
      privateKey: notaryPrivateKey,
      publicKey: notaryPublicKey,
      account: notaryAccount,
    } = await newAccount(1);
    const { account } = await newAccount(2);
    const xrd = await LTSRadixEngineToolkit.Derive.knownAddresses(
      NetworkId.Simulator
    ).then((addressBook) => addressBook.resources.xrdResource);

    // Act
    const transaction = await SimpleTransactionBuilder.new({
      networkId: NetworkId.Simulator,
      validFromEpoch: 2,
      fromAccount: notaryAccount,
      signerPublicKey: notaryPublicKey,
    }).then((builder) =>
      builder
        .lockedFee(10)
        .transferFungible({
          amount: 100,
          resourceAddress: xrd,
          toAccount: account,
        })
        .compileIntent()
        .compileNotarizedAsync(async (signedIntentHash: Uint8Array) =>
          Promise.resolve(notaryPrivateKey.signToSignature(signedIntentHash))
        )
    );

    // Assert
    transaction
      .staticallyValidate(NetworkId.Simulator)
      .then((validity) => validity.throwIfInvalid());
  });

  it("Simple transactions with different fee payer is summarized as expected.", async () => {
    // Arrange
    const {
      privateKey: notaryPrivateKey,
      publicKey: notaryPublicKey,
      account: notaryAccount,
    } = await newAccount(1);
    const { account } = await newAccount(2);
    const xrd = await LTSRadixEngineToolkit.Derive.knownAddresses(
      NetworkId.Simulator
    ).then((addressBook) => addressBook.resources.xrdResource);

    // Act
    const transaction = await SimpleTransactionBuilder.new({
      networkId: NetworkId.Simulator,
      validFromEpoch: 2,
      fromAccount: notaryAccount,
      signerPublicKey: notaryPublicKey,
    }).then((builder) =>
      builder
        .lockedFee(10)
        .feePayer(account)
        .transferFungible({
          amount: 100,
          resourceAddress: xrd,
          toAccount: account,
        })
        .compileIntent()
        .compileNotarized(notaryPrivateKey)
    );

    // Assert
    const summary = await transaction.summarizeTransaction();
    expect(summary.feesLocked).toEqual({ account, amount: new Decimal(10) });
  });

  it("Simple transaction builder free XRD transactions are summarized as expected", async () => {
    // Arrange
    let account1 =
      "account_sim1cyvafxgf9j252pexxlxuuh5vhepqw9t2js0wc9q4nngs4zv5l7hcph";

    // Act
    const notarizedTransaction =
      await SimpleTransactionBuilder.freeXrdFromFaucet({
        toAccount: account1,
        networkId: 0xf2,
        validFromEpoch: 10,
      });

    // Assert
    let [faucetComponentAddress, xrdResourceAddress] =
      await RadixEngineToolkit.Utils.knownAddresses(0xf2).then((x) => [
        x.componentAddresses.faucet,
        x.resourceAddresses.xrd,
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

  it("Simple transaction builder can generate transactions with more than a single signer", async () => {
    // Arrange
    let privateKey1 = new PrivateKey.Ed25519(
      "d52618de62aa37a9fdac229614ca931d9e509e00cd01ff9f465e5dba5e17be8b"
    );
    let privateKey2 = new PrivateKey.Ed25519(
      "3d7f447bce7a669581452010226dc6437cf5efbdaee5ceff25894e8299410404"
    );

    let resourceAddress1 =
      "resource_sim1t5xrnrtvwcww0rc94u5a8spkkwuh764rwt7g22g2gkuwjmk9zt727j";

    let account1 =
      "account_sim1cyvafxgf9j252pexxlxuuh5vhepqw9t2js0wc9q4nngs4zv5l7hcph";
    let account2 =
      "account_sim1c9w650rsdhew62vulr2kcds082738v5vrthj8nvnsk5uvp6aqu2rud";

    // Act
    const builder = await SimpleTransactionBuilder.new({
      networkId: NetworkId.Simulator,
      validFromEpoch: 10,
      fromAccount: account1,
      signerPublicKey: privateKey1.publicKey(),
    });
    const signedTransactionIntent = builder
      .transferFungible({
        toAccount: account2,
        resourceAddress: resourceAddress1,
        amount: 100,
      })
      .compileIntentWithSignatures([
        (hashToSign: Uint8Array) =>
          privateKey2.signToSignatureWithPublicKey(hashToSign),
      ]);

    // Assert
    expect(
      signedTransactionIntent["signedIntent"].intentSignatures.length
    ).toBe(1);

    const notarizedTransaction =
      signedTransactionIntent.compileNotarized(privateKey1);
    notarizedTransaction
      .staticallyValidate(0xf2)
      .then((x) => x.throwIfInvalid());
  });

  it("Simple transaction builder can generate transactions with more than a single signer async", async () => {
    // Arrange
    let privateKey1 = new PrivateKey.Ed25519(
      "d52618de62aa37a9fdac229614ca931d9e509e00cd01ff9f465e5dba5e17be8b"
    );
    let privateKey2 = new PrivateKey.Ed25519(
      "3d7f447bce7a669581452010226dc6437cf5efbdaee5ceff25894e8299410404"
    );

    let resourceAddress1 =
      "resource_sim1t5xrnrtvwcww0rc94u5a8spkkwuh764rwt7g22g2gkuwjmk9zt727j";

    let account1 =
      "account_sim1cyvafxgf9j252pexxlxuuh5vhepqw9t2js0wc9q4nngs4zv5l7hcph";
    let account2 =
      "account_sim1c9w650rsdhew62vulr2kcds082738v5vrthj8nvnsk5uvp6aqu2rud";

    // Act
    const builder = await SimpleTransactionBuilder.new({
      networkId: NetworkId.Simulator,
      validFromEpoch: 10,
      fromAccount: account1,
      signerPublicKey: privateKey1.publicKey(),
    });
    const signedTransactionIntent = await builder
      .transferFungible({
        toAccount: account2,
        resourceAddress: resourceAddress1,
        amount: 100,
      })
      .compileIntentWithSignaturesAsync([
        (hashToSign: Uint8Array) =>
          Promise.resolve(privateKey2.signToSignatureWithPublicKey(hashToSign)),
      ]);

    // Assert
    expect(
      signedTransactionIntent["signedIntent"].intentSignatures.length
    ).toBe(1);

    const notarizedTransaction =
      signedTransactionIntent.compileNotarized(privateKey1);
    notarizedTransaction
      .staticallyValidate(0xf2)
      .then((x) => x.throwIfInvalid());
  });

  it("A transaction that has a message is statically valid", async () => {
    // Arrange
    let privateKey = new PrivateKey.Ed25519(
      "d52618de62aa37a9fdac229614ca931d9e509e00cd01ff9f465e5dba5e17be8b"
    );

    const manifest = new ManifestBuilder().dropAllProofs().build();
    const header: TransactionHeader = {
      networkId: NetworkId.Simulator,
      startEpochInclusive: 0x00,
      endEpochExclusive: 0x10,
      nonce: 0x00,
      notaryPublicKey: privateKey.publicKey(),
      notaryIsSignatory: true,
      tipPercentage: 0x00,
    };

    // Act
    const transaction = await TransactionBuilder.new().then((builder) =>
      builder
        .header(header)
        .plainTextMessage("Hello World!")
        .manifest(manifest)
        .sign(privateKey)
        .notarize(privateKey)
    );

    // Assert
    const staticValidity =
      await RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
        transaction,
        defaultValidationConfig(NetworkId.Simulator)
      );
    expect(staticValidity.kind).toBe("Valid");
  });
});

const newAccount = async (
  num: number
): Promise<{
  publicKey: PublicKey;
  privateKey: PrivateKey;
  account: string;
}> => {
  const maybeInvalidHex = num.toString(16);
  const hex =
    maybeInvalidHex.length % 2 ? maybeInvalidHex : `0${maybeInvalidHex}`;

  let array = Array.from(Convert.HexString.toUint8Array(hex));
  while (array.length < 32) {
    array = [0].concat(array);
  }

  const privateKey = new PrivateKey.Secp256k1(new Uint8Array(array));
  const publicKey = privateKey.publicKey();
  const account =
    await RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
      publicKey,
      NetworkId.Simulator
    );
  return { privateKey, publicKey, account };
};
