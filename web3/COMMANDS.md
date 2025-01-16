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
npx hardhat verify --network fuji 0x12Cc82427cF17De614A3F30FB8e79D91634B86F7

https://testnet.snowtrace.io/address/0x12Cc82427cF17De614A3F30FB8e79D91634B86F7 --> Check contract
