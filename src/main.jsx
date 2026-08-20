import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        "414726974628-sho7dn0j0tlrqh0048mf83b0latpk45o.apps.googleusercontent.com"
      }
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
