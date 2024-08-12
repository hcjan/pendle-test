// Import required libraries
import { ethers } from "hardhat";

async function main() {
    const pendleERC20SYAdd = "0xa49edd50ec26E75c0546902a2545b0856f8B4C54";
    const yieldTokenAdd = "0x246820C5BBc491475d96D2094F1c831E4f7a7089";

    const [signer] = await ethers.getSigners();
    
    // Get the PendleERC20SY contract instance
    const PendleERC20SY = await ethers.getContractAt("PendleERC20SY", pendleERC20SYAdd);

    // Amount of shares to redeem (in wei)
    const amountSharesToRedeem = ethers.parseEther("1"); // Adjust this value as needed

    // Minimum amount of tokens to receive (set to 0 for this example, but in production, calculate this value)
    const minTokenOut = 0;


        // Redeem tokens
        const tx = await PendleERC20SY.redeem(
            signer.address, // receiver
            amountSharesToRedeem, // amountSharesToRedeem
            yieldTokenAdd, // tokenOut
            minTokenOut, // minTokenOut
            false // burnFromInternalBalance (set to false to burn from user's balance)
        );

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        console.log("Redeem successful!");
        console.log("Transaction hash:", receipt.transactionHash);

       
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
