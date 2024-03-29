import {
  RadixEngineToolkit,
  SimpleTransactionBuilder,
} from "@radixdlt/radix-engine-toolkit";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [informationResponse, setInformationResponse] = useState("");
  const [txValidity, setTxValidity] = useState("");

  useEffect(() => {
    (async () => {
      let informationResponse = await RadixEngineToolkit.Build.information();
      setInformationResponse(JSON.stringify(informationResponse));

      const notarizedTransaction =
        await SimpleTransactionBuilder.freeXrdFromFaucet({
          toAccount:
            "account_sim1c9muh25vh063ywj3zt2ggmqeud2w4u7nf68r9rsqp0m7l4580rmaqz",
          networkId: 0xf2,
          validFromEpoch: 10,
        });
      setTxValidity(
        JSON.stringify(await notarizedTransaction.staticallyValidate(0xf2))
      );
    })();
  }, [informationResponse, txValidity]);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p>The Radix Engine Toolkit works in react as an ES6 module</p>
      <pre style={{ textAlign: "left" }}>{informationResponse}</pre>

      <p>Building a transaction to get funds from the faucet.</p>
      <pre style={{ textAlign: "left" }}>{txValidity}</pre>
    </div>
  );
}

export default App;
