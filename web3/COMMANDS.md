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
npx hardhat verify --network fuji 0x5e8C0e894a04D52af33A965ceD7a4555b56E6136

https://testnet.snowtrace.io/address/0x5e8C0e894a04D52af33A965ceD7a4555b56E6136#code --> Check contract
