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

import {
  Configuration,
  StatusApi,
  TransactionApi,
  TransactionStatus,
  TransactionStatusOutput,
  TransactionSubmitOutput,
} from "@radixdlt/babylon-gateway-api-sdk";
import {
  Convert,
  ManifestAstValue,
  ManifestBuilder,
  PrivateKey,
  RadixEngineToolkit,
  TransactionBuilder,
  TransactionHeader,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";

const NetworkConfiguration = {
  gatewayBaseUrl: "https://rcnet.radixdlt.com",
  networkId: 0x0c,
};

const getCurrentEpoch = async (statusApi: StatusApi): Promise<number> =>
  statusApi.gatewayStatus().then((output) => output.ledger_state.epoch);

const submitTransaction = async (
  transactionApi: TransactionApi,
  compiledTransaction: Uint8Array
): Promise<TransactionSubmitOutput> =>
  transactionApi.transactionSubmit({
    transactionSubmitInput: {
      notarized_transaction_hex:
        Convert.Uint8Array.toHexString(compiledTransaction),
    },
  });

const getTransactionStatus = async (
  transactionApi: TransactionApi,
  transactionId: Uint8Array
): Promise<TransactionStatusOutput> =>
  transactionApi.transactionStatus({
    transactionStatusInput: {
      intent_hash_hex: Convert.Uint8Array.toHexString(transactionId),
    },
  });

const main = async () => {
  // Setting up the Gateway Sub-APIs that will be used in this example. We will be utilizing two sub
  // APIs: the Status API to get the current epoch and the transaction API to submit and query the
  // status of transactions on the network.
  const apiConfiguration = new Configuration({
    basePath: NetworkConfiguration.gatewayBaseUrl,
  });
  const statusApi = new StatusApi(apiConfiguration);
  const transactionApi = new TransactionApi(apiConfiguration);

  // Setting up the private key of the transaction notary.
  const notaryPrivateKey = new PrivateKey.Secp256k1(
    "1df0292c520543a4d8e43e230c29e4c7b49669ec71940fea1b87be3224bc6442"
  );

  // Building the manifest of this example. The manifest for this example will be quite simple: it
  // will lock some amount of XRD in fees from the faucet's component.
  const faucetComponentAddress = await RadixEngineToolkit.knownEntityAddresses(
    NetworkConfiguration.networkId
  ).then((output) => output.faucetComponentAddress);

  const manifest = new ManifestBuilder()
    .callMethod(faucetComponentAddress, "lock_fee", [
      new ManifestAstValue.Decimal(10),
    ])
    .build();

  // With the manifest constructed above, we may now construct the complete transaction. Part of the
  // transaction construction requires knowledge of the ledger state, more specifically, we need to
  // have knowledge of the current epoch of the network to set the epoch bounds in the transaction
  // header. This information can be obtained from the gateway API through the status API.
  const currentEpoch = await getCurrentEpoch(statusApi);
  const notarizedTransaction = (await TransactionBuilder.new())
    .header(
      new TransactionHeader(
        NetworkConfiguration.networkId,
        currentEpoch,
        currentEpoch + 10,
        await generateRandomNonce(),
        notaryPrivateKey.publicKey(),
        true,
        0
      )
    )
    .manifest(manifest)
    .notarize(notaryPrivateKey);

  // After the transaction has been built, we can get the transaction id (transaction hash) which is
  // the identifier used to get information on this transaction through the gateway.
  const transactionId = await notarizedTransaction.transactionId();
  console.log("Transaction ID:", Convert.Uint8Array.toHexString(transactionId));

  // After the transaction has been built, it can be printed to the console as a JSON string if the
  // developer wishes to inspect it visually in any way.
  console.log("Transaction:", notarizedTransaction.toString());

  // To submit the transaction to the Gateway API, it must first be compiled or converted from its
  // human readable format down to an array of bytes that can be consumed by the gateway. This can
  // be done by calling the compile method on the transaction object.
  const compiledTransaction = await notarizedTransaction.compile();
  console.log(
    "Compiled Transaction:",
    Convert.Uint8Array.toHexString(compiledTransaction)
  );

  // Now that we have the compiled transaction, we can submit it to the Gateway API.
  const submissionResult = await submitTransaction(
    transactionApi,
    compiledTransaction
  );
  console.log("Transaction submission result:", submissionResult);

  // There will be some time needed for the transaction to be propagated to nodes and then processed
  // by the network. We will poll the transaction status until the transaction is eventually
  // committed
  const transactionStatus = undefined;
  while (
    transactionStatus === undefined ||
    transactionStatus?.status === TransactionStatus.Pending
  ) {
    transactionStatus = await getTransactionStatus(
      transactionApi,
      transactionId
    );
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log("Transaction Status:", transactionStatus);
};
main();
