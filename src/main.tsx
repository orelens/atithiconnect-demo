import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DemoProvider } from "./store";
import "./index.css";
import { isStandalone } from "./pwa";

if (isStandalone()) document.documentElement.classList.add("standalone");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/atithiconnect-demo">
      <DemoProvider>
        <App />
      </DemoProvider>
    </BrowserRouter>
  </StrictMode>
);
