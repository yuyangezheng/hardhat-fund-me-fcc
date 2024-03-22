// function deployFunc() {
//     console.log("Hi!")
//     hre.getNamedAccounts()
// }

// module.exports.default = deployFunc

/////above is way #1
// module.exports = async (hre) => {
//     const {getNamedAccounts, deployments} = hre

// }

///Above is way #2

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

//const helperConfig = require("../helper-hardhat-config")
//const networkConfig = helperConfig.networkConfig

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainID // WTFFFFFFFFFFFFFFFFFF
    console.log("hi")
    console.log(chainId)
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeed
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const fundMe = await deploy("FundMe", {
        from: deployer, //list of overrides
        args: [ethUsdPriceFeedAddress], //args for constructor (priceFeed address)
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address)
    }
    ;("_________________________________________________________________________")
}
module.exports.tags = ["all", "fundme"]
