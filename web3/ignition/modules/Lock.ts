import { ethers } from "hardhat";

async function main() {
  // Get the ContractFactory for the contract
  const LockCont = await ethers.getContractFactory("Lock");

  console.log("Deploying Lock...");
  const Lock = await LockCont.deploy();

  // Wait for the deployment to complete
  await Lock.waitForDeployment();

  // Get the deployed contract's address
  const contractAddress = await Lock.getAddress();
  console.log("Lock deployed to:", contractAddress);
}

// Proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
