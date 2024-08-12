
    // Import required libraries
import { ethers } from "hardhat";

async function main() {
  
    const yieldTokenAdd = "0x246820C5BBc491475d96D2094F1c831E4f7a7089"
    const pendleERC20SYAdd = "0xa49edd50ec26E75c0546902a2545b0856f8B4C54"

    const [signer] = await ethers.getSigners();
    // Get the PendleERC20SY contract instance
    const PendleERC20SY = await ethers.getContractAt("PendleERC20SY", pendleERC20SYAdd);

    // Amount to deposit (in wei)
    const amountToDeposit = ethers.parseEther("1"); // Adjust this value as needed

    // Approve the PendleERC20SY contract to spend tokens
    const yieldToken = await ethers.getContractAt("IERC20", yieldTokenAdd);
    const approveTx = await yieldToken.approve(pendleERC20SYAdd, amountToDeposit);
    await approveTx.wait();

    console.log("Approved!");

    // Transfer tokens to PendleERC20SY contract
    const transferTx = await yieldToken.transfer(pendleERC20SYAdd, amountToDeposit);
    await transferTx.wait();
    

    console.log("Transferred tokens to PendleERC20SY contract!");
    console.log("Amount transferred:", ethers.formatEther(amountToDeposit), "tokens");

    // Check the balance of PendleERC20SY contract after transfer
    const balanceAfter = await yieldToken.balanceOf(pendleERC20SYAdd);
    console.log("PendleERC20SY contract balance after transfer:", ethers.formatEther(balanceAfter), "tokens");
    // // Deposit tokens
    // const tx = await PendleERC20SY.deposit(
    //     signer.address, // receiver
    //     yieldTokenAdd, // tokenIn
    //     amountToDeposit, // amountTokenToDeposit
    //     0 // minSharesOut (set to 0 for this example, but in production, calculate this value)
    // );

    // // Wait for the transaction to be mined
    // const receipt = await tx.wait();

    // console.log("Deposit successful!");
    // console.log("Transaction hash:", receipt.transactionHash);
}

main();