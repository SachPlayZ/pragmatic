import { http, createConfig } from "wagmi";
import { mainnet, sepolia, baseSepolia, avalancheFuji } from "wagmi/chains";
import { connectors } from "./wallets";
import { Chain } from "@rainbow-me/rainbowkit";

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
