const radixEngineToolkit = require("@radixdlt/radix-engine-toolkit");

(async () => {
  let informationResponse =
    await radixEngineToolkit.RadixEngineToolkit.Build.information();
  console.log(informationResponse);
})();
