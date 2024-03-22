const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config.js")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.parseEther("5") //5000000000000000000' //1eth
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"]) //deploy all with "all" tag
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", async function () {
              it("Should set the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.target)
              })
          })

          describe("fund", async function () {
              it("The conttract  fails if there  is not enough eth", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })
              it("Updated  the amount funded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder  to  array of getFunder", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("It can  withdraw eth from a single founder", async function () {
                  //arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  //Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //assert
                  const gasCost =
                      transactionReceipt.gasUsed * transactionReceipt.gasPrice
                  // console.log(ethers.formatEther(startingFundMeBalance))
                  // console.log(ethers.formatEther(startingDeployerBalance))
                  // console.log(ethers.formatEther(endingFundMeBalance))
                  // console.log(ethers.formatEther(endingDeployerBalance))
                  // console.log("-------------------------")
                  // console.log(ethers.formatEther(gasCost))
                  // console.log("-------------------------")
                  // console.log(
                  //     (
                  //         (startingFundMeBalance) +
                  //         (startingDeployerBalance)
                  //     ).toString()
                  // )
                  // console.log((endingDeployerBalance + gasCost).toString())

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
              })

              it("It can  withdraw eth from a single founder CHEAPLY", async function () {
                  //arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //assert
                  const gasCost =
                      transactionReceipt.gasUsed * transactionReceipt.gasPrice
                  // console.log(ethers.formatEther(startingFundMeBalance))
                  // console.log(ethers.formatEther(startingDeployerBalance))
                  // console.log(ethers.formatEther(endingFundMeBalance))
                  // console.log(ethers.formatEther(endingDeployerBalance))
                  // console.log("-------------------------")
                  // console.log(ethers.formatEther(gasCost))
                  // console.log("-------------------------")
                  // console.log(
                  //     (
                  //         (startingFundMeBalance) +
                  //         (startingDeployerBalance)
                  //     ).toString()
                  // )
                  // console.log((endingDeployerBalance + gasCost).toString())

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
              })

              it("Allows us to withdraw with multiple founders", async function () {
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      ) // currently connected to deployer
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  const gasCost =
                      transactionReceipt.gasUsed * transactionReceipt.gasPrice
                  // console.log(ethers.formatEther(startingFundMeBalance))
                  // console.log(ethers.formatEther(startingDeployerBalance))
                  // console.log(ethers.formatEther(endingFundMeBalance))
                  // console.log(ethers.formatEther(endingDeployerBalance))
                  // console.log(ethers.formatEther(gasCost))
                  // console.log(
                  //     (
                  //         Number(startingFundMeBalance) +
                  //         Number(startingDeployerBalance)
                  //     ).toString()
                  // )
                  // console.log((Number(endingDeployerBalance) + gasCost).toString())

                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )

                  //check that getFunder array is rest properly
                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (i = 1; i < 6; i++) {
                      const a = await fundMe.getAddressToAmountFunded(
                          accounts[i].address
                      )
                      assert.equal(a, 0)
                      console.log(a)
                  }
              })

              it("Allows us to withdraw with multiple founders CHEAPLY", async function () {
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      ) // currently connected to deployer
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  const gasCost =
                      transactionReceipt.gasUsed * transactionReceipt.gasPrice
                  // console.log(ethers.formatEther(startingFundMeBalance))
                  // console.log(ethers.formatEther(startingDeployerBalance))
                  // console.log(ethers.formatEther(endingFundMeBalance))
                  // console.log(ethers.formatEther(endingDeployerBalance))
                  // console.log(ethers.formatEther(gasCost))
                  // console.log(
                  //     (
                  //         Number(startingFundMeBalance) +
                  //         Number(startingDeployerBalance)
                  //     ).toString()
                  // )
                  // console.log((Number(endingDeployerBalance) + gasCost).toString())

                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )

                  //check that getFunder array is rest properly
                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (i = 1; i < 6; i++) {
                      const a = await fundMe.getAddressToAmountFunded(
                          accounts[i].address
                      )
                      assert.equal(a, 0)
                      console.log(a)
                  }
              })

              it("Only allow owner to withdraw funds", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.rejectedWith("FundMe__NotOwner")
              })
          })
      })
