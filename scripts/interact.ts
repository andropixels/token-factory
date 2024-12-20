import { ethers } from "hardhat";

async function main() {
  try {
    // Token Factory address on Sepolia
    const FACTORY_ADDRESS = "0xA61e07d3253eE68c4d2cBf581C70afc2096F8FEA";
    
    console.log("Getting signer...");
    const [deployer] = await ethers.getSigners();
    console.log("Interacting with address:", await deployer.getAddress());

    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    const factory = TokenFactory.attach(FACTORY_ADDRESS);

    // Create a new token
    console.log("Creating new token...");
    const tx = await factory.create_erc20(
      "MyTestToken",  // name
      "MTK",         // symbol
      18,           // decimals
      ethers.parseEther("1000000")  // 1 million tokens
    );

    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for transaction confirmation...");
    
    const receipt = await tx.wait();
    const event = receipt?.logs.find(
      (x: any) => x.fragment?.name === "TokenCreated"
    );

    if (event) {
      const tokenAddress = event.args[0];  // first parameter is token address
      console.log("New token created at address:", tokenAddress);

      const Token = await ethers.getContractFactory("CustomToken");
      const token = Token.attach(tokenAddress);

      const name = await token.name();
      const symbol = await token.symbol();
      const decimals = await token.decimals();
      const totalSupply = await token.totalSupply();

      console.log("\nToken Details:");
      console.log("Name:", name);
      console.log("Symbol:", symbol);
      console.log("Decimals:", decimals);
      console.log("Total Supply:", ethers.formatEther(totalSupply));
      const balance = await token.balanceOf(deployer.address);
      console.log("Your token balance:", ethers.formatEther(balance));
    } else {
      console.log("Couldn't find TokenCreated event in the transaction receipt");
    }

  } catch (error) {
    console.error("Error:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
