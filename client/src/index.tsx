import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.tsx";
import { WagmiProvider } from "wagmi";
import { config } from "./providers/config.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";

const root = createRoot(document.getElementById("root")!);

const queryClient = new QueryClient();

root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <AnonAadhaarProvider>
        <RainbowKitProvider
          modalSize="wide"
          initialChain={43113}
          theme={darkTheme({
            accentColor: "#ff8000",
            accentColorForeground: "white",
            borderRadius: "small",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <StrictMode>
            <App />
          </StrictMode>
        </RainbowKitProvider>
      </AnonAadhaarProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
