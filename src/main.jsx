import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import process from "process";
import React from "react";
import {
  FpjsProvider,
  FingerprintJSPro,
} from "@fingerprintjs/fingerprintjs-pro-react";

window.process = process;

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <FpjsProvider
    loadOptions={{
      apiKey: "0vNO9SkMR7Vu0goOFiNh",
      endpoint: [
        // "https://metrics.yourwebsite.com",
        FingerprintJSPro.defaultEndpoint,
      ],
      scriptUrlPattern: [
        // "https://metrics.yourwebsite.com/web/v<version>/<apiKey>/loader_v<loaderVersion>.js",
        FingerprintJSPro.defaultScriptUrlPattern,
      ],
      // region: "eu"
    }}
  >
    <App />
  </FpjsProvider>
  // </StrictMode>,
);
