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
npx hardhat verify --network fuji 0x02D0af43274684FAB59368557110F7461616c858

https://testnet.snowtrace.io/address/0x02D0af43274684FAB59368557110F7461616c858 --> Check contract
