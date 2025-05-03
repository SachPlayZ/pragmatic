import { http, createConfig } from "wagmi";
import { Chain } from "@rainbow-me/rainbowkit";
import { connectors } from "./wallets";

const customChain = {
  id: 50002,
  name: "Pharos Devnet",
  nativeCurrency: {
    decimals: 18,
    name: "Pharos",
    symbol: "PHR",
  },
  rpcUrls: {
    public: { http: ["https://devnet.dplabs-internal.com"] },
    default: { http: ["https://devnet.dplabs-internal.com"] },
  },
  blockExplorers: {
    default: { name: "PharosScan", url: "https://pharosscan.xyz/" },
  },
} as const satisfies Chain;

const chains: readonly [Chain, ...Chain[]] = [customChain];

export const config = createConfig({
  chains,
  connectors,
  transports: {
    [customChain.id]: http("http://localhost:3000/api/proxy"),
  },
});
