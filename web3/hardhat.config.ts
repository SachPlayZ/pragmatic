import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    artifacts: "./src",
  },
  networks: {
    "pharos-devnet": {
      url: "https://devnet.dplabs-internal.com",
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      "pharos-devnet": "XXXX",
    },
    customChains: [
      {
        network: "pharos-devnet",
        chainId: 50002,
        urls: {
          apiURL: "https://devnet.dplabs-internal.com/api",
          browserURL: "https://devnet.dplabs-internal.com",
        },
      },
    ],
  },
};

export default config;
