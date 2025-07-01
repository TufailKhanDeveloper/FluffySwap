import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy MyToken (FLUF)
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(
    "FluffyToken",      // name
    "FLUF",             // symbol
    18,                 // decimals
    1000000,            // initial supply (1M tokens)
    deployer.address    // owner
  );
  
  await myToken.waitForDeployment();
  console.log("MyToken deployed to:", await myToken.getAddress());

  // Deploy FluffySwap
  const FluffySwap = await ethers.getContractFactory("FluffySwap");
  const fluffySwap = await FluffySwap.deploy(
    await myToken.getAddress(),  // token address
    1000,                        // 1 ETH = 1000 FLUF tokens
    deployer.address             // owner
  );
  
  await fluffySwap.waitForDeployment();
  console.log("FluffySwap deployed to:", await fluffySwap.getAddress());

  // Transfer some tokens to the FluffySwap contract for liquidity
  const liquidityAmount = ethers.parseEther("500000"); // 500k tokens
  await myToken.transfer(await fluffySwap.getAddress(), liquidityAmount);
  console.log("Transferred liquidity to FluffySwap contract");

  // Save deployment addresses
  const deploymentInfo = {
    MyToken: await myToken.getAddress(),
    FluffySwap: await fluffySwap.getAddress(),
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });