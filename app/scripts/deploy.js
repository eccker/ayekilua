const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, World!");

  // const Token = await hre.ethers.getContractFactory("Token");
  // const token = await Token.deploy();

  const AYEKIToken = await hre.ethers.getContractFactory("AYEKIToken");
  const ayekitoken = await AYEKIToken.deploy("Ayekilua Token", "AYEKI");

  await greeter.deployed();
  await ayekitoken.deployed();

  console.log("Greeter deployed to:", greeter.address);
  console.log("ayekitoken deployed to:", ayekitoken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });