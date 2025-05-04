import { ethers } from "hardhat";

async function main() {
  // Get the ContractFactory for the contract
  const CheckCont = await ethers.getContractFactory("Check");

  console.log("Deploying Check...");
  const Check = await CheckCont.deploy();

  // Wait for the deployment to complete
  await Check.waitForDeployment();

  // Get the deployed contract's address
  const contractAddress = await Check.getAddress();
  console.log("Check deployed to:", contractAddress);
}

// Proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
