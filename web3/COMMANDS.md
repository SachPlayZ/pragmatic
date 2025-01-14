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
npx hardhat verify --network fuji 0x6713B379e1c5FCeD42650A3fae3A5f7D5ba6ba45

https://testnet.snowtrace.io/address/0x6713B379e1c5FCeD42650A3fae3A5f7D5ba6ba45 --> Check contract
