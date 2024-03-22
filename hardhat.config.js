require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")
require("dotenv").config()
//require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("solc")
//require("@nomiclabs/hardhat-solhint");

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC = process.env.sepolia_RPC_URL
const PRIVATE_KEY = process.env.Private_Key
const ETHERSCAN_API_KEY = process.env.etherscan_API_key
const COINMARKETCAP_API_KEY = process.env.coinmarketcap_API_Key

module.exports = {
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    networks: {
        sepolia: {
            url: SEPOLIA_RPC,
            accounts: [PRIVATE_KEY],
            chainID: 11155111,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            //accounts: [0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80, 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d],
            chainID: 31337,
            blockConfirmations: 1,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        noColors: true,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            11155111: 0,
        },
    },
}
