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
npx hardhat verify --network fuji 0x6576f5690e89F3a097E2BFbe3E4F1cBfbEC41A95

https://testnet.snowtrace.io/address/0x6576f5690e89F3a097E2BFbe3E4F1cBfbEC41A95 --> Check contract
