import { ethers } from "hardhat";

async function main() {
  try {
    // Get the deployer's address
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log("Deploying from address:", address);

   
    const balance = await ethers.provider.getBalance(address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");


    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    

    const feeData = await ethers.provider.getFeeData();
  
    const deploymentEstimate = await TokenFactory.getDeployTransaction().then(tx => 
      ethers.provider.estimateGas(tx)
    );
 const estimatedCost = deploymentEstimate * (feeData.gasPrice ?? 0n);
    console.log("Estimated deployment cost:", ethers.formatEther(estimatedCost), "ETH");

    if (balance < estimatedCost) {
      throw new Error(`Insufficient funds. Need ${ethers.formatEther(estimatedCost)} ETH but have ${ethers.formatEther(balance)} ETH`);
    }

console.log("Deploying TokenFactory...");
    const tokenFactory = await TokenFactory.deploy();
    await tokenFactory.waitForDeployment();

    console.log("TokenFactory deployed to:", await tokenFactory.getAddress());

  } catch (error) {
    console.error("Error:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
