import { ethers } from "hardhat";

async function main() {
    const CheckCont = await ethers.getContractFactory("Check");

    console.log("Deploying Check...");
    const Check = await CheckCont.deploy();

    await Check.waitForDeployment();

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
