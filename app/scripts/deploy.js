const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const Stamper = await hre.ethers.getContractFactory("Stamper");
  const stamper = await Stamper.deploy("Ayekilua Meditative Axolotl Game");
  await stamper.deployed();
  const stamperAddress = stamper.address;

  const Market = await hre.ethers.getContractFactory("NFTMarket");
  const market = await Market.deploy();
  await market.deployed();
  const marketAddress = market.address

  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await NFT.deploy(marketAddress)
  await nft.deployed()
  const nftContractAddress = nft.address

  const Token = await hre.ethers.getContractFactory("Token");
  const ayekitoken = await Token.deploy("Ayekilua Token", "AYEKI");
  await ayekitoken.deployed();
  const tokenContractAddress = ayekitoken.address

  console.log("market deployed to:", marketAddress);
  console.log("NFT deployed to:", nftContractAddress);
  console.log("ayekitoken deployed to:", tokenContractAddress);
  console.log("Stamper deployed to:", stamperAddress)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });