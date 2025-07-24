// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import * as dotenv from "dotenv";

// dotenv.config({ path: __dirname + "/.env" });
// const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || "";

// const config: HardhatUserConfig = {
//   solidity: "0.8.28",
//   paths: {
//     artifacts: "./src",
//   },
//   networks: {
//     "pharos-devnet": {
//       url: "https://devnet.dplabs-internal.com",
//       accounts: [ACCOUNT_PRIVATE_KEY],
//     },
//   },
//   etherscan: {
//     apiKey: {
//       "pharos-devnet": "XXXX",
//     },
//     customChains: [
//       {
//         network: "pharos-devnet",
//         chainId: 50002,
//         urls: {
//           apiURL: "https://devnet.dplabs-internal.com/api",
//           browserURL: "https://devnet.dplabs-internal.com",
//         },
//       },
//     ],
//   },
// };

// export default config;
import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";

const { RPC_URL_ETH, RPC_URL_BASE, ETHERSCAN_API, BASESCAN_API, PRIVATE_KEY } =
    process.env;

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    networks: {
        sepolia: {
            url: RPC_URL_ETH || "",
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
        },
        baseSepolia: {
            url: RPC_URL_BASE || "",
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
        },
    },
    etherscan: {
        apiKey: {
            "base-sepolia": `${BASESCAN_API}`,
            sepolia: `${ETHERSCAN_API}`,
        },
        customChains: [
            {
                network: "base-sepolia",
                chainId: 84532,
                urls: {
                    apiURL: "https://base-sepolia.blockscout.com/api",
                    browserURL: "https://base-sepolia.blockscout.com",
                },
            },
        ],
    },
    sourcify: {
        enabled: true,
    },
};

export default config;
