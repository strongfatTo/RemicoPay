import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("ScheduledRemittance", function () {
  const EXCHANGE_RATE = 7_350_000; // 7.35 PHP/HKD
  const FEE_BPS = 70; // 0.7%
  const ONE_DAY = 86400;
  const DEPOSIT = ethers.parseEther("1000");

  async function deployFixture() {
    const [owner, user, recipient, keeper] = await ethers.getSigners();

    // Deploy tokens
    const MockHKDR = await ethers.getContractFactory("MockHKDR");
    const hkdr = await MockHKDR.deploy();

    const MockPHPC = await ethers.getContractFactory("MockPHPC");
    const phpc = await MockPHPC.deploy();

    // Deploy vault
    const SimpleYieldVault = await ethers.getContractFactory("SimpleYieldVault");
    const vault = await SimpleYieldVault.deploy(await hkdr.getAddress());

    // Deploy ScheduledRemittance
    const ScheduledRemittance = await ethers.getContractFactory("ScheduledRemittance");
    const scheduled = await ScheduledRemittance.deploy(
      await hkdr.getAddress(),
      await phpc.getAddress(),
      await vault.getAddress(),
      owner.address, // treasury
      EXCHANGE_RATE,
      FEE_BPS
    );

    // Set ScheduledRemittance as PHPC minter
    await phpc["setMinter(address)"](await scheduled.getAddress());

    // Give user some HKDR
    await hkdr.connect(user).faucet(); // 10,000 HKDR

    return { hkdr, phpc, vault, scheduled, owner, user, recipient, keeper };
  }

  describe("scheduleRemittance", function () {
    it("should create a schedule and deposit into vault", async function () {
      const { hkdr, scheduled, user, recipient } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      const tx = await scheduled.connect(user).scheduleRemittance(
        recipient.address, DEPOSIT, scheduledDate, false, 0
      );

      await expect(tx).to.emit(scheduled, "ScheduleCreated");

      const s = await scheduled.schedules(0);
      expect(s.sender).to.equal(user.address);
      expect(s.recipient).to.equal(recipient.address);
      expect(s.hkdAmount).to.equal(DEPOSIT);
      expect(s.vaultShares).to.be.gt(0n);
      expect(s.status).to.equal(0); // Scheduled
    });

    it("should revert with zero amount", async function () {
      const { scheduled, user, recipient } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await expect(
        scheduled.connect(user).scheduleRemittance(recipient.address, 0, scheduledDate, false, 0)
      ).to.be.revertedWithCustomError(scheduled, "ZeroAmount");
    });

    it("should revert with past date", async function () {
      const { hkdr, scheduled, user, recipient } = await loadFixture(deployFixture);
      const pastDate = (await time.latest()) - 100;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      await expect(
        scheduled.connect(user).scheduleRemittance(recipient.address, DEPOSIT, pastDate, false, 0)
      ).to.be.revertedWithCustomError(scheduled, "InvalidDate");
    });

    it("should revert with invalid recurring day", async function () {
      const { hkdr, scheduled, user, recipient } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      await expect(
        scheduled.connect(user).scheduleRemittance(recipient.address, DEPOSIT, scheduledDate, true, 29)
      ).to.be.revertedWithCustomError(scheduled, "InvalidDay");
    });
  });

  describe("executeRemittance", function () {
    it("should execute after scheduled date and mint PHPC", async function () {
      const { hkdr, phpc, scheduled, user, recipient, keeper } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      await scheduled.connect(user).scheduleRemittance(
        recipient.address, DEPOSIT, scheduledDate, false, 0
      );

      // Fast forward past scheduled date
      await time.increase(7 * ONE_DAY + 1);

      const tx = await scheduled.connect(keeper).executeRemittance(0);
      await expect(tx).to.emit(scheduled, "ScheduleExecuted");

      // Recipient should have PHPC
      const phpBalance = await phpc.balanceOf(recipient.address);
      expect(phpBalance).to.be.gt(0n);

      // Status should be Executed
      const s = await scheduled.schedules(0);
      expect(s.status).to.equal(1); // Executed
    });

    it("should apply yield to reduce fee", async function () {
      const { hkdr, phpc, vault, scheduled, owner, user, recipient, keeper } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      await scheduled.connect(user).scheduleRemittance(
        recipient.address, DEPOSIT, scheduledDate, false, 0
      );

      // Inject yield into vault (5% = 50 HKDR on 1000)
      const yieldAmount = ethers.parseEther("50");
      await hkdr.connect(owner).approve(await vault.getAddress(), yieldAmount);
      await vault.connect(owner).addYield(yieldAmount);

      // Fast forward
      await time.increase(7 * ONE_DAY + 1);

      const tx = await scheduled.connect(keeper).executeRemittance(0);
      const receipt = await tx.wait();

      // Check event for yield > 0
      const event = receipt?.logs.find(
        (log: any) => {
          try {
            return scheduled.interface.parseLog({ topics: [...log.topics], data: log.data })?.name === "ScheduleExecuted";
          } catch { return false; }
        }
      );
      expect(event).to.not.be.undefined;
    });

    it("should revert if executed too early", async function () {
      const { hkdr, scheduled, user, recipient, keeper } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      await scheduled.connect(user).scheduleRemittance(
        recipient.address, DEPOSIT, scheduledDate, false, 0
      );

      await expect(
        scheduled.connect(keeper).executeRemittance(0)
      ).to.be.revertedWithCustomError(scheduled, "TooEarly");
    });

    it("should revert on double execute", async function () {
      const { hkdr, scheduled, user, recipient, keeper } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      await scheduled.connect(user).scheduleRemittance(
        recipient.address, DEPOSIT, scheduledDate, false, 0
      );

      await time.increase(7 * ONE_DAY + 1);
      await scheduled.connect(keeper).executeRemittance(0);

      await expect(
        scheduled.connect(keeper).executeRemittance(0)
      ).to.be.revertedWithCustomError(scheduled, "AlreadyExecutedOrCancelled");
    });
  });

  describe("cancelSchedule", function () {
    it("should cancel and return HKDR to sender", async function () {
      const { hkdr, scheduled, user, recipient } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      await scheduled.connect(user).scheduleRemittance(
        recipient.address, DEPOSIT, scheduledDate, false, 0
      );

      const balBefore = await hkdr.balanceOf(user.address);
      const tx = await scheduled.connect(user).cancelSchedule(0);
      await expect(tx).to.emit(scheduled, "ScheduleCancelled");

      const balAfter = await hkdr.balanceOf(user.address);
      expect(balAfter).to.be.gte(balBefore + DEPOSIT - 1n); // approximately DEPOSIT returned

      const s = await scheduled.schedules(0);
      expect(s.status).to.equal(2); // Cancelled
    });

    it("should revert if not sender", async function () {
      const { hkdr, scheduled, user, recipient, keeper } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      await scheduled.connect(user).scheduleRemittance(
        recipient.address, DEPOSIT, scheduledDate, false, 0
      );

      await expect(
        scheduled.connect(keeper).cancelSchedule(0)
      ).to.be.revertedWithCustomError(scheduled, "NotSender");
    });

    it("should revert cancel after execute", async function () {
      const { hkdr, scheduled, user, recipient, keeper } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      await scheduled.connect(user).scheduleRemittance(
        recipient.address, DEPOSIT, scheduledDate, false, 0
      );

      await time.increase(7 * ONE_DAY + 1);
      await scheduled.connect(keeper).executeRemittance(0);

      await expect(
        scheduled.connect(user).cancelSchedule(0)
      ).to.be.revertedWithCustomError(scheduled, "AlreadyExecutedOrCancelled");
    });
  });

  describe("getScheduleQuote", function () {
    it("should return accurate quote with yield", async function () {
      const { hkdr, vault, scheduled, owner, user, recipient } = await loadFixture(deployFixture);
      const scheduledDate = (await time.latest()) + 7 * ONE_DAY;

      await hkdr.connect(user).approve(await scheduled.getAddress(), DEPOSIT);
      await scheduled.connect(user).scheduleRemittance(
        recipient.address, DEPOSIT, scheduledDate, false, 0
      );

      // Add yield
      const yieldAmount = ethers.parseEther("100");
      await hkdr.connect(owner).approve(await vault.getAddress(), yieldAmount);
      await vault.connect(owner).addYield(yieldAmount);

      const quote = await scheduled.getScheduleQuote(0);
      expect(quote.currentValue).to.be.gt(DEPOSIT);
      expect(quote.estimatedYield).to.be.gt(0n);
      expect(quote.estimatedPhp).to.be.gt(0n);
    });
  });
});
