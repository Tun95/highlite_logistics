import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <Router>
    <HelmetProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </HelmetProvider>
  </Router>,
);
