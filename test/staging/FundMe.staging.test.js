const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config.js")
const { assert, expect } = require("chai")

//terniary operator
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.parseEther("0.5") //5000000000000000000' //5eth
          beforeEach(async function () {
              console.log("1")
              deployer = (await getNamedAccounts()).deployeer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("Allows people to fund and withdraw", async function () {
              console.log("2")
              const fundTxResponse = await fundMe.fund({ value: sendValue })
              console.log("3")
              await fundTxResponse.wait(1)
              console.log("4")
              const withdrawResponse = await fundMe.withdraw()
              console.log("5")
              await withdrawResponse.wait(1)
              console.log("6")
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.target
              )
              console.log("6")
              console.log(endingBalance)
              assert.equal(endingBalance.toString(), "0")
          })
      })
