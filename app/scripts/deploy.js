const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const Stamper = await hre.ethers.getContractFactory("Stamper");
  const stamper = await Stamper.deploy("Ayekilua Meditative Axolotl Game");

  const Token = await hre.ethers.getContractFactory("Token");
  const ayekitoken = await Token.deploy("Ayekilua Token", "AYEKI");

  await stamper.deployed();
  await ayekitoken.deployed();

  console.log("stamper deployed to:", stamper.address);
  console.log("ayekitoken deployed to:", ayekitoken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });