import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        elements: {
          avatarBox: {
            width: "48px",
            height: "48px",
          },
          userButtonBox: {
            width: "48px",
            height: "48px",
          },
          userButtonTrigger: {
            width: "48px",
            height: "48px",
          },
          userButtonAvatarBox: {
            width: "48px",
            height: "48px",
          },
          userButtonTrigger: {
            width: "48px",
            height: "48px",
          },
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
);
