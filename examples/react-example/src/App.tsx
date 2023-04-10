import { RadixEngineToolkit } from "@radixdlt/radix-engine-toolkit";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [informationResponse, setInformationResponse] = useState("");

  useEffect(() => {
    (async () => {
      let informationResponse = (await RadixEngineToolkit.information())();
      setInformationResponse(JSON.stringify(informationResponse));
    })();
  }, [informationResponse]);

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
    </div>
  );
}

export default App;
