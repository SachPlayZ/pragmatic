import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "dotenv/config";

const FUJI_RPC_URL = process.env.FUJI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const FUJI_API_KEY = process.env.FUJI_API_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    fuji: {
      url: `${FUJI_RPC_URL}`,
      accounts: [`${PRIVATE_KEY}`],
      chainId: 43113,
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: `${FUJI_API_KEY}`,
    },
  },
  sourcify: {
    enabled: true,
  },
  solidity: "0.8.28",
};

export default config;
