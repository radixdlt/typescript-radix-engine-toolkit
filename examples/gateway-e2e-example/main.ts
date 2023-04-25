import {
  Configuration,
  StatusApi,
  TransactionApi,
  TransactionStatus,
  TransactionStatusResponse,
  TransactionSubmitResponse,
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
  statusApi.gatewayStatus().then((response) => response.ledger_state.epoch);

const submitTransaction = async (
  transactionApi: TransactionApi,
  compiledTransaction: Uint8Array
): Promise<TransactionSubmitResponse> =>
  transactionApi.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex:
        Convert.Uint8Array.toHexString(compiledTransaction),
    },
  });

const getTransactionStatus = async (
  transactionApi: TransactionApi,
  transactionId: Uint8Array
): Promise<TransactionStatusResponse> =>
  transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: Convert.Uint8Array.toHexString(transactionId),
    },
  });

const main = async () => {
  // Setting up the Gateway Sub-APIs that will be used in this example. We will be utilizing two sub
  // APIs: the Status API to get the current epoch and the transaction API to submit and query the
  // status of transactions on the network.
  let apiConfiguration = new Configuration({
    basePath: NetworkConfiguration.gatewayBaseUrl,
  });
  let statusApi = new StatusApi(apiConfiguration);
  let transactionApi = new TransactionApi(apiConfiguration);

  // Setting up the private key of the transaction notary.
  let notaryPrivateKey = new PrivateKey.EcdsaSecp256k1(
    "1df0292c520543a4d8e43e230c29e4c7b49669ec71940fea1b87be3224bc6442"
  );

  // Building the manifest of this example. The manifest for this example will be quite simple: it
  // will lock some amount of XRD in fees from the faucet's component.
  let faucetComponentAddress = await RadixEngineToolkit.knownEntityAddresses(
    NetworkConfiguration.networkId
  ).then((response) => response.faucetComponentAddress);

  let manifest = new ManifestBuilder()
    .callMethod(faucetComponentAddress, "lock_fee", [
      new ManifestAstValue.Decimal(10),
    ])
    .build();

  // With the manifest constructed above, we may now construct the complete transaction. Part of the
  // transaction construction requires knowledge of the ledger state, more specifically, we need to
  // have knowledge of the current epoch of the network to set the epoch bounds in the transaction
  // header. This information can be obtained from the gateway API through the status API.
  let currentEpoch = await getCurrentEpoch(statusApi);
  let notarizedTransaction = (await TransactionBuilder.new())
    .header(
      new TransactionHeader(
        1,
        NetworkConfiguration.networkId,
        currentEpoch,
        currentEpoch + 10,
        await generateRandomNonce(),
        notaryPrivateKey.publicKey(),
        true,
        100_000_000,
        0
      )
    )
    .manifest(manifest)
    .notarize(notaryPrivateKey);

  // After the transaction has been built, we can get the transaction id (transaction hash) which is
  // the identifier used to get information on this transaction through the gateway.
  let transactionId = await notarizedTransaction.transactionId();
  console.log("Transaction ID:", Convert.Uint8Array.toHexString(transactionId));

  // After the transaction has been built, it can be printed to the console as a JSON string if the
  // developer wishes to inspect it visually in any way.
  console.log("Transaction:", notarizedTransaction.toString());

  // To submit the transaction to the Gateway API, it must first be compiled or converted from its
  // human readable format down to an array of bytes that can be consumed by the gateway. This can
  // be done by calling the compile method on the transaction object.
  let compiledTransaction = await notarizedTransaction.compile();
  console.log(
    "Compiled Transaction:",
    Convert.Uint8Array.toHexString(compiledTransaction)
  );

  // Now that we have the compiled transaction, we can submit it to the Gateway API.
  let submissionResult = await submitTransaction(
    transactionApi,
    compiledTransaction
  );
  console.log("Transaction submission result:", submissionResult);

  // There will be some time needed for the transaction to be propagated to nodes and then processed
  // by the network. We will poll the transaction status until the transaction is eventually
  // committed
  let transactionStatus = undefined;
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
