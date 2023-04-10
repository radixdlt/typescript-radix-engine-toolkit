const radixEngineToolkit = require("@radixdlt/radix-engine-toolkit");

(async () => {
  let informationResponse = (
    await radixEngineToolkit.RadixEngineToolkit.information()
  )();
  console.log(informationResponse);
})();
