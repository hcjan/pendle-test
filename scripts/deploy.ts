import { ethers } from "hardhat";
import * as PendleERC20SY from "../build/artifacts/contracts/core/StandardizedYield/implementations/PendleERC20SY.sol/PendleERC20SY.json";


async function main() {
    const [signer] = await ethers.getSigners();
    console.log("Signer address:", signer.address);
    const provider =   new ethers.JsonRpcProvider("https://canto-testnet.plexnode.wtf");
    console.log("Signer balance:", await provider.getBalance(signer.address));

//   const MockToken = await ethers.getContractFactory("MockToken");
//   const mockToken = await MockToken.deploy("Mock Token", "MTK");
//   await mockToken.waitForDeployment();
//   console.log("MockToken deployed to:", await mockToken.getAddress());
//   // Deploy PendleERC20SY
//   const PendleERC20SY = await ethers.getContractFactory("PendleERC20SY");
//   const pendleERC20SY = await PendleERC20SY.deploy("Pendle ERC20 SY", "PESY", await mockToken.getAddress());
//   await pendleERC20SY.waitForDeployment();
//   console.log("PendleERC20SY deployed to:", await pendleERC20SY.getAddress());

}

main().catch(console.error);