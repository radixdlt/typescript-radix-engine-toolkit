import { CoreApiClient } from "@radixdlt/babylon-core-api-sdk";
import {
  LTSRadixEngineToolkit,
  NetworkId,
  PrivateKey,
  SimpleTransactionBuilder,
} from "@radixdlt/radix-engine-toolkit";
import fetch from "node-fetch"; // 2.6.9
import { default as http, default as https } from "node:http";

// NOTE:
// To run this, you will need to have a local node running - see https://github.com/radixdlt/babylon-node/tree/main/testnet-node
// Then check out this repository, go to examples/core-e2e-example, and run `yarn` to install followed by `yarn start`

// Polyfill global crypto (works on NodeJS 15+) - comment the below line out if wanting to run this a web browser
global.crypto = require("crypto").webcrypto;

export async function generateSecureRandomBytes(
  count: number
): Promise<Uint8Array> {
  const byteArray = new Uint8Array(count);
  global.crypto.getRandomValues(byteArray);
  return byteArray;
}

// NOTE - the below function is for example purposes only
// It is up to you to ensure that your generation of key pairs is safe for production use
async function generateEd25519PrivateKey(): Promise<PrivateKey.Ed25519> {
  return new PrivateKey.Ed25519(await generateSecureRandomBytes(32));
}

const networkId = NetworkId.Kisharnet;
const logicalNetworkName = "kisharnet";
const coreApiBase = "http://127.0.0.1:3333/core"; // Note - in nodeJS, you may need to use 127.0.0.1 instead of localhost
const dashboardBase = "https://rcnet-dashboard.radixdlt.com";

async function generateNewEd25519VirtualAccount(networkId: number) {
  const privateKey = await generateEd25519PrivateKey();
  const publicKey = privateKey.publicKey();
  const address = await LTSRadixEngineToolkit.Derive.virtualAccountAddress(
    publicKey,
    networkId
  );
  return {
    privateKey,
    publicKey,
    address,
    dashboardLink: `${dashboardBase}/account/${address}`,
  };
}

async function pollForCommit(
  coreApiClient: CoreApiClient,
  intentHash: string
): Promise<void> {
  const pollAttempts = 200;
  const pollDelayMs = 5000;

  for (let i = 0; i < pollAttempts; i++) {
    const statusOutput = await coreApiClient.LTS.getTransactionStatus({
      intent_hash: intentHash,
    });
    switch (statusOutput.intent_status) {
      case "CommittedSuccess":
        console.info(
          `Transaction ${intentHash} was committed successfully: ${dashboardBase}/transaction/${intentHash}`
        );
        return;
      case "CommittedFailure":
      case "PermanentRejection":
        // You will typically wish to build a new transaction and try again.
        throw new Error(
          `Transaction was not committed successfully - instead it resulted in: ${statusOutput.intent_status} with description: ${statusOutput.status_description}`
        );
      case "NotSeen":
      case "InMempool":
      case "FateUncertain":
      case "FateUncertainButLikelyRejection":
        // We keep polling
        if (i < pollAttempts) {
          console.debug(
            `Transaction ${intentHash} [status poll ${
              i + 1
            }/${pollAttempts} - retrying in ${pollDelayMs}ms] - STATUS: ${
              statusOutput.intent_status
            } DESCRIPTION: ${statusOutput.status_description}`
          );
          await new Promise((resolve) => setTimeout(resolve, pollDelayMs));
        } else {
          throw new Error(
            `Transaction was not committed successfully within ${pollAttempts} poll attempts over ${
              pollAttempts * pollDelayMs
            }ms - instead it resulted in STATUS: ${
              statusOutput.intent_status
            } DESCRIPTION: ${statusOutput.status_description}`
          );
        }
    }
  }
}

async function getTestnetXrd(
  coreApiClient: CoreApiClient,
  accountAddress: string
): Promise<string> {
  const constructionMetadata =
    await coreApiClient.LTS.getConstructionMetadata();

  const notary = await generateNewEd25519VirtualAccount(networkId);
  const freeXrdForAccount1Transaction =
    await SimpleTransactionBuilder.freeXrdFromFaucet({
      networkId,
      toAccount: accountAddress,
      validFromEpoch: constructionMetadata.current_epoch,
    });

  const transactionIntentHashHex =
    freeXrdForAccount1Transaction.intentHashHex();

  await coreApiClient.LTS.submitTransaction({
    notarized_transaction_hex: freeXrdForAccount1Transaction.toHex(),
  });
  await pollForCommit(coreApiClient, transactionIntentHashHex);

  return transactionIntentHashHex;
}

const main = async () => {
  const account1 = await generateNewEd25519VirtualAccount(networkId);
  const account2 = await generateNewEd25519VirtualAccount(networkId);
  const knownAddresses = await LTSRadixEngineToolkit.Derive.knownAddresses(
    networkId
  );
  const xrd = knownAddresses.resources.xrdResource;

  console.log(`Account 1: ${account1.dashboardLink}`);
  console.log(`Account 2: ${account2.dashboardLink}`);

  const coreApiClient = await CoreApiClient.initialize({
    basePath: coreApiBase,
    logicalNetworkName,
    fetch,
    // Configuration for fixing issues with node-fetch
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
  });

  const faucetTransactionIntentHash = await getTestnetXrd(
    coreApiClient,
    account1.address
  );

  console.log(
    `Account 1 has been topped up with 10000 Testnet XRD: ${dashboardBase}/transaction/${faucetTransactionIntentHash}`
  );

  const constructionMetadata =
    await coreApiClient.LTS.getConstructionMetadata();
  const builder = await SimpleTransactionBuilder.new({
    networkId,
    validFromEpoch: constructionMetadata.current_epoch,
    fromAccount: account1.address,
    signerPublicKey: account1.publicKey,
  });

  // Note - by default this sets to permanently reject after 2 epochs (5-10 minutes)
  const unsignedTransaction = builder
    .transferFungible({
      toAccount: account2.address,
      resourceAddress: xrd,
      amount: 100,
    })
    .compileIntent();

  const notarySignature = account1.privateKey.signToSignature(
    unsignedTransaction.hashToNotarize
  );

  const notarizedTransaction =
    unsignedTransaction.compileNotarized(notarySignature);

  const intentHashHex = notarizedTransaction.intentHashHex();

  console.log(
    `Submitting XRD transfer from account 1 to account 2: ${intentHashHex}`
  );
  await coreApiClient.LTS.submitTransaction({
    notarized_transaction_hex: notarizedTransaction.toHex(),
  });
  await pollForCommit(coreApiClient, intentHashHex);
};

main();
