"use client";
import { http, createConfig } from "wagmi";
import { mainnet, sepolia, baseSepolia, avalancheFuji } from "wagmi/chains";
import { connectors } from "./wallets";
import { Chain, darkTheme } from "@rainbow-me/rainbowkit";

const chains: readonly [Chain, ...Chain[]] = [
  sepolia,
  mainnet,
  baseSepolia,
  avalancheFuji,
];

export const config = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [avalancheFuji.id]: http(),
  },
});

export const theme = darkTheme({
  accentColor: "#9EF01A",
  accentColorForeground: "#0A1A1F",
  borderRadius: "large",
  fontStack: "system",
  overlayBlur: "large",
});
