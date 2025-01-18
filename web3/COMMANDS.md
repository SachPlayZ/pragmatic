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
npx hardhat verify --network fuji 0x3Db4466B64173A3d380453278CF11086128e7D4e

https://testnet.snowtrace.io/address/0x3Db4466B64173A3d380453278CF11086128e7D4e --> Check contract
