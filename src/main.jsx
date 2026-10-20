import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
const root = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// Public pages are prerendered at build time; admin stays client-rendered.
if (root.hasChildNodes() && !window.location.pathname.startsWith("/admin"))
  hydrateRoot(root, app);
else createRoot(root).render(app);
