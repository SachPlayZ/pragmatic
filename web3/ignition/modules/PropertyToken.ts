import { ethers } from "hardhat";

async function main() {
  // Get the ContractFactory for the contract
  const PropertyTokenCont = await ethers.getContractFactory("PropertyToken");

  console.log("Deploying Air...");
  const Prop = await PropertyTokenCont.deploy();

  // Wait for the deployment to complete
  await Prop.waitForDeployment();

  // Get the deployed contract's address
  const contractAddress = await Prop.getAddress();
  console.log("PropertyToken deployed to:", contractAddress);
}

// Proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
