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
npx hardhat verify --network fuji 0x08c2c514247c7464cDFDE2FC14C3Eb1ffBc56967

https://testnet.snowtrace.io/address/0x08c2c514247c7464cDFDE2FC14C3Eb1ffBc56967#code --> Check contract
