const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;
const { parseUnits } = require("ethers");

describe("Vesting", function () {
  let vesting, token, owner, admin, user;
  const amount = parseUnits("100", 18);
  const unlockDelay = 3600; // 1 hour

  beforeEach(async function () {
    [owner, admin, user] = await ethers.getSigners();

    // Deploy ERC20 token
    const Token = await ethers.getContractFactory("Token1");
    token = await Token.deploy();
    await token.waitForDeployment();

    // Deploy Vesting contract
    const Vesting = await ethers.getContractFactory("Vesting");
    vesting = await Vesting.deploy();
    await vesting.waitForDeployment();

    // Transfer tokens to vesting contract
    await token.transfer(vesting.target, amount);

    // Add admin
    await vesting.addAdmin(admin.address);

    // Add vesting entry
    const blockTime = (await ethers.provider.getBlock("latest")).timestamp;
    const unlockTime = blockTime + unlockDelay;
    await vesting.connect(admin).addVesting(user.address, amount, unlockTime, token.target);
  });

  it("should allow claiming after unlock time", async function () {
    await ethers.provider.send("evm_increaseTime", [unlockDelay + 1]);
    await ethers.provider.send("evm_mine");

    const balanceBefore = await token.balanceOf(user.address);
    await vesting.connect(user).claimTokens();
    const balanceAfter = await token.balanceOf(user.address);

    expect(balanceAfter - balanceBefore).to.equal(amount);
  });

  it("should not allow claiming twice", async function () {
    await ethers.provider.send("evm_increaseTime", [unlockDelay + 1]);
    await ethers.provider.send("evm_mine");

    await vesting.connect(user).claimTokens();
    await expect(vesting.connect(user).claimTokens()).to.be.revertedWith("Already claimed");
  });

  it("should not allow non-admin to add vesting", async function () {
    const blockTime = (await ethers.provider.getBlock("latest")).timestamp;
    const unlockTime = blockTime + unlockDelay;
    await expect(
      vesting.connect(user).addVesting(user.address, amount, unlockTime, token.target)
    ).to.be.revertedWith("Not whitelisted");
  });

  it("should allow owner to add and remove admin", async function () {
    await vesting.removeAdmin(admin.address);

    const blockTime = (await ethers.provider.getBlock("latest")).timestamp;
    const unlockTime = blockTime + unlockDelay;

    await expect(
      vesting.connect(admin).addVesting(user.address, amount, unlockTime, token.target)
    ).to.be.revertedWith("Not whitelisted");
  });
});
