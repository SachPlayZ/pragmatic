compile:
npx hardhat compile

deploy:
npx hardhat run ignition/modules/PropertyToken.ts --network fuji

verify:
npx hardhat verify --network fuji <ct address>

#2
compile:
npx hardhat compile

deploy:
npx hardhat run ignition/modules/Check.ts --network fuji

verify:
npx hardhat verify --network fuji 0x4c41E3d779bB35114e2776B11410c84FA728a284

https://testnet.snowtrace.io/address/0x4c41E3d779bB35114e2776B11410c84FA728a284#code --> Check contract
