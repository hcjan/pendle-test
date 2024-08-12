
    // Import required libraries
    import { ethers } from "hardhat";

    async function main() {
      
        const yieldTokenAdd = "0x246820C5BBc491475d96D2094F1c831E4f7a7089"
        const pendleERC20SYAdd = "0xa49edd50ec26E75c0546902a2545b0856f8B4C54"
    
        const [signer] = await ethers.getSigners();
        // Get the PendleERC20SY contract instance
        const PendleERC20SY = await ethers.getContractAt("PendleERC20SY", pendleERC20SYAdd);
    
        console.log(await PendleERC20SY.balanceOf(signer.address))

        const yieldToken = await ethers.getContractAt("IERC20", yieldTokenAdd);
        console.log(await yieldToken.balanceOf(pendleERC20SYAdd))
    }
    
    main();