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
npx hardhat verify --network fuji 0xAa9e6FEe61A70fd7CFB5221E0d40f5d6a5C2c983

https://testnet.snowtrace.io/address/0xfd4F95F894a856588074B96dde84484c307B2929 --> Check contract
