const radixEngineToolkit = require("@radixdlt/radix-engine-toolkit");

const information = async () => {
  const informationResponse =
    await radixEngineToolkit.RadixEngineToolkit.information();
  console.log(informationResponse);
};

const constructFaucetTx = async () => {
  const notarizedTransaction =
    await radixEngineToolkit.SimpleTransactionBuilder.freeXrdFromFaucet({
      forAccount:
        "account_sim1qjdkmaevmu7ggs3jyruuykx2u5c2z7mp6wjk5f5tpy6swx5788",
      networkId: 0xf2,
      startEpoch: 10,
    });
  const validity = await notarizedTransaction.staticallyValidate(0xf2);
  console.log(validity);
};

(async () => {
  await information();
  await constructFaucetTx();
})();
