compile:
npx hardhat compile

deploy:
npx hardhat run ignition/modules/PropertyToken.ts --network fuji

verify:
npx hardhat verify --network fuji 0xA95723055A1EC9F1B0bF295664979A2822C2c829
