import '@typechain/hardhat';
import "hardhat-contract-sizer";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
function viaIR(version: string, runs: number) {
    return {
        version,
        settings: {
            optimizer: {
                enabled: true,
                runs: runs,
            },
            evmVersion: 'paris',
            viaIR: true,
        },
    };
}

const config: HardhatUserConfig = {
    networks: {
        "canto": {
          url: "https://canto-testnet.plexnode.wtf",
          accounts: [PRIVATE_KEY]
        },
        "arbitrum": {
          url: "https://arb-sepolia.g.alchemy.com/v2/I-ZVEdUQy4Mk3rwbsNAIp_MVql6coseO",
          accounts: [PRIVATE_KEY]
        }
      },
    paths: {
        sources: './contracts',
        tests: './test',
        artifacts: "./build/artifacts",
        cache: "./build/cache"
    },
    solidity: {
        compilers: [
            {
                version: '0.8.23',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 0,
                    },
                    evmVersion: 'paris'
                },
            }
        ],
        overrides: {
            'contracts/router/ActionAddRemoveLiqV3.sol': viaIR('0.8.23', 10000),
            'contracts/router/ActionMiscV3.sol': viaIR('0.8.23', 1000000),
            'contracts/router/ActionSwapPTV3.sol': viaIR('0.8.23', 1000000),
            'contracts/router/ActionSwapYTV3.sol': viaIR('0.8.23', 1000000),
            'contracts/router/ActionCallbackV3.sol': viaIR('0.8.23', 1000000),
            'contracts/router/PendleRouterV3.sol': viaIR('0.8.23', 1000000),
            'contracts/limit/PendleLimitRouter.sol': viaIR('0.8.23', 1000000),
        },
    },
    contractSizer: {
        disambiguatePaths: false,
        runOnCompile: false,
        strict: true,
        only: [],
    }
};

export default config;
