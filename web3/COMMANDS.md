compile:
npx hardhat compile

deploy:
npx hardhat run ignition/modules/PropertyToken.ts --network fuji

verify:
npx hardhat verify --network fuji 0xea1d24996dC82DD1DC25460090df048Fb51E26bD
