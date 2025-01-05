import { ethers } from "hardhat";

async function main() {
  // Get the ContractFactory for the contract
  const AirCont = await ethers.getContractFactory("Air");

  console.log("Deploying Air...");
  const Air = await AirCont.deploy();

  // Wait for the deployment to complete
  await Air.waitForDeployment();

  // Get the deployed contract's address
  const contractAddress = await Air.getAddress();
  console.log("Air deployed to:", contractAddress);
}

// Proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
