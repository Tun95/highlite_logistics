import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <Router>
    <ThemeProvider>
      <HelmetProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </HelmetProvider>
    </ThemeProvider>
  </Router>,
);
