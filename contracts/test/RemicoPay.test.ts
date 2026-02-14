import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

// Constants
const EXCHANGE_RATE = 7_350_000n; // 7.35 PHP per HKD (scaled by 1e6)
const FEE_BPS = 70n;              // 0.7%
const FAUCET_AMOUNT = ethers.parseEther("10000");

describe("RemicoPay", function () {
  async function deployFixture() {
    const [owner, sender, recipient, other] = await ethers.getSigners();

    // Deploy MockHKDR
    const MockHKDR = await ethers.getContractFactory("MockHKDR");
    const hkdr = await MockHKDR.deploy();

    // Deploy MockPHPC
    const MockPHPC = await ethers.getContractFactory("MockPHPC");
    const phpc = await MockPHPC.deploy();

    // Deploy RemicoPay
    const RemicoPay = await ethers.getContractFactory("RemicoPay");
    const remicoPay = await RemicoPay.deploy(
      await hkdr.getAddress(),
      await phpc.getAddress(),
      EXCHANGE_RATE,
      FEE_BPS
    );

    // Set RemicoPay as minter on PHPC
    await phpc.setMinter(await remicoPay.getAddress());

    // Give sender some HKDR via faucet
    await hkdr.connect(sender).faucet();

    return { hkdr, phpc, remicoPay, owner, sender, recipient, other };
  }

  // ─── Deployment ───────────────────────────────────────────────────

  describe("Deployment", function () {
    it("should set correct initial parameters", async function () {
      const { remicoPay, hkdr, phpc } = await loadFixture(deployFixture);
      expect(await remicoPay.exchangeRate()).to.equal(EXCHANGE_RATE);
      expect(await remicoPay.feeBps()).to.equal(FEE_BPS);
      expect(await remicoPay.hkdr()).to.equal(await hkdr.getAddress());
      expect(await remicoPay.phpc()).to.equal(await phpc.getAddress());
      expect(await remicoPay.nextRemitId()).to.equal(0);
    });

    it("should revert on zero address for tokens", async function () {
      const RemicoPay = await ethers.getContractFactory("RemicoPay");
      await expect(
        RemicoPay.deploy(ethers.ZeroAddress, ethers.ZeroAddress, EXCHANGE_RATE, FEE_BPS)
      ).to.be.revertedWithCustomError(RemicoPay, "ZeroAddress");
    });

    it("should revert on zero exchange rate", async function () {
      const { hkdr, phpc } = await loadFixture(deployFixture);
      const RemicoPay = await ethers.getContractFactory("RemicoPay");
      await expect(
        RemicoPay.deploy(await hkdr.getAddress(), await phpc.getAddress(), 0, FEE_BPS)
      ).to.be.revertedWithCustomError(RemicoPay, "InvalidRate");
    });

    it("should revert on fee > 10%", async function () {
      const { hkdr, phpc } = await loadFixture(deployFixture);
      const RemicoPay = await ethers.getContractFactory("RemicoPay");
      await expect(
        RemicoPay.deploy(await hkdr.getAddress(), await phpc.getAddress(), EXCHANGE_RATE, 1001)
      ).to.be.revertedWithCustomError(RemicoPay, "InvalidFee");
    });
  });

  // ─── MockHKDR Faucet ──────────────────────────────────────────────

  describe("MockHKDR Faucet", function () {
    it("should mint faucet amount", async function () {
      const { hkdr, sender } = await loadFixture(deployFixture);
      expect(await hkdr.balanceOf(sender.address)).to.equal(FAUCET_AMOUNT);
    });

    it("should enforce cooldown", async function () {
      const { hkdr, sender } = await loadFixture(deployFixture);
      await expect(hkdr.connect(sender).faucet())
        .to.be.revertedWithCustomError(hkdr, "FaucetCooldown");
    });
  });

  // ─── getQuote ─────────────────────────────────────────────────────

  describe("getQuote", function () {
    it("should return correct PHP amount and fee for 1000 HKD", async function () {
      const { remicoPay } = await loadFixture(deployFixture);
      const hkdAmount = ethers.parseEther("1000");

      const [phpAmount, fee, rate] = await remicoPay.getQuote(hkdAmount);

      // fee = 1000 * 70 / 10000 = 7 HKDR
      const expectedFee = ethers.parseEther("7");
      // netHkd = 1000 - 7 = 993 HKDR
      // phpAmount = 993 * 7.35 = 7298.55 PHPC
      const expectedPhp = (ethers.parseEther("993") * EXCHANGE_RATE) / 1_000_000n;

      expect(fee).to.equal(expectedFee);
      expect(phpAmount).to.equal(expectedPhp);
      expect(rate).to.equal(EXCHANGE_RATE);
    });

    it("should revert on zero amount", async function () {
      const { remicoPay } = await loadFixture(deployFixture);
      await expect(remicoPay.getQuote(0))
        .to.be.revertedWithCustomError(remicoPay, "ZeroAmount");
    });
  });

  // ─── createRemittance ─────────────────────────────────────────────

  describe("createRemittance", function () {
    it("should create remittance and lock HKDR", async function () {
      const { remicoPay, hkdr, sender, recipient } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("1000");

      // Approve first
      await hkdr.connect(sender).approve(await remicoPay.getAddress(), amount);

      // Create remittance
      const tx = await remicoPay.connect(sender).createRemittance(recipient.address, amount);

      // Check event
      await expect(tx).to.emit(remicoPay, "RemittanceCreated").withArgs(
        0, sender.address, recipient.address,
        amount,
        (ethers.parseEther("993") * EXCHANGE_RATE) / 1_000_000n, // phpAmount
        ethers.parseEther("7"),   // fee
        EXCHANGE_RATE             // rate
      );

      // Check HKDR transferred to contract
      expect(await hkdr.balanceOf(await remicoPay.getAddress())).to.equal(amount);

      // Check remittance stored
      const remit = await remicoPay.getRemittance(0);
      expect(remit.sender).to.equal(sender.address);
      expect(remit.recipient).to.equal(recipient.address);
      expect(remit.hkdAmount).to.equal(amount);
      expect(remit.status).to.equal(0); // Pending

      // Check nextRemitId incremented
      expect(await remicoPay.nextRemitId()).to.equal(1);
    });

    it("should revert on zero recipient", async function () {
      const { remicoPay, hkdr, sender } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");
      await hkdr.connect(sender).approve(await remicoPay.getAddress(), amount);

      await expect(
        remicoPay.connect(sender).createRemittance(ethers.ZeroAddress, amount)
      ).to.be.revertedWithCustomError(remicoPay, "ZeroAddress");
    });

    it("should revert on zero amount", async function () {
      const { remicoPay, sender, recipient } = await loadFixture(deployFixture);

      await expect(
        remicoPay.connect(sender).createRemittance(recipient.address, 0)
      ).to.be.revertedWithCustomError(remicoPay, "ZeroAmount");
    });

    it("should revert without approval", async function () {
      const { remicoPay, sender, recipient } = await loadFixture(deployFixture);

      await expect(
        remicoPay.connect(sender).createRemittance(recipient.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });

    it("should lock exchange rate at creation time", async function () {
      const { remicoPay, hkdr, sender, recipient, owner } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");
      await hkdr.connect(sender).approve(await remicoPay.getAddress(), amount);

      await remicoPay.connect(sender).createRemittance(recipient.address, amount);

      // Change rate after creation
      const newRate = 8_000_000n;
      await remicoPay.connect(owner).setExchangeRate(newRate);

      // Remittance should still have old rate
      const remit = await remicoPay.getRemittance(0);
      expect(remit.lockedRate).to.equal(EXCHANGE_RATE);
    });
  });

  // ─── completeRemittance ───────────────────────────────────────────

  describe("completeRemittance", function () {
    it("should mint PHPC to recipient on completion", async function () {
      const { remicoPay, hkdr, phpc, sender, recipient, owner } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("1000");

      // Create remittance
      await hkdr.connect(sender).approve(await remicoPay.getAddress(), amount);
      await remicoPay.connect(sender).createRemittance(recipient.address, amount);

      // Complete remittance
      const tx = await remicoPay.connect(owner).completeRemittance(0);

      const expectedPhp = (ethers.parseEther("993") * EXCHANGE_RATE) / 1_000_000n;
      await expect(tx).to.emit(remicoPay, "RemittanceCompleted")
        .withArgs(0, recipient.address, expectedPhp);

      // Check PHPC minted to recipient
      expect(await phpc.balanceOf(recipient.address)).to.equal(expectedPhp);

      // Check status updated
      const remit = await remicoPay.getRemittance(0);
      expect(remit.status).to.equal(1); // Completed
    });

    it("should revert if not owner", async function () {
      const { remicoPay, hkdr, sender, recipient, other } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");
      await hkdr.connect(sender).approve(await remicoPay.getAddress(), amount);
      await remicoPay.connect(sender).createRemittance(recipient.address, amount);

      await expect(
        remicoPay.connect(other).completeRemittance(0)
      ).to.be.revertedWithCustomError(remicoPay, "OwnableUnauthorizedAccount");
    });

    it("should revert on non-existent remittance", async function () {
      const { remicoPay, owner } = await loadFixture(deployFixture);
      await expect(
        remicoPay.connect(owner).completeRemittance(999)
      ).to.be.revertedWithCustomError(remicoPay, "RemittanceNotFound");
    });

    it("should revert on already completed remittance", async function () {
      const { remicoPay, hkdr, sender, recipient, owner } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");
      await hkdr.connect(sender).approve(await remicoPay.getAddress(), amount);
      await remicoPay.connect(sender).createRemittance(recipient.address, amount);
      await remicoPay.connect(owner).completeRemittance(0);

      await expect(
        remicoPay.connect(owner).completeRemittance(0)
      ).to.be.revertedWithCustomError(remicoPay, "RemittanceNotPending");
    });
  });

  // ─── refundRemittance ─────────────────────────────────────────────

  describe("refundRemittance", function () {
    it("should return HKDR to sender on refund", async function () {
      const { remicoPay, hkdr, sender, recipient, owner } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("500");
      await hkdr.connect(sender).approve(await remicoPay.getAddress(), amount);
      await remicoPay.connect(sender).createRemittance(recipient.address, amount);

      const balBefore = await hkdr.balanceOf(sender.address);
      const tx = await remicoPay.connect(owner).refundRemittance(0);

      await expect(tx).to.emit(remicoPay, "RemittanceRefunded")
        .withArgs(0, sender.address, amount);

      // Check HKDR returned
      expect(await hkdr.balanceOf(sender.address)).to.equal(balBefore + amount);

      // Check status
      const remit = await remicoPay.getRemittance(0);
      expect(remit.status).to.equal(2); // Refunded
    });

    it("should revert if not owner", async function () {
      const { remicoPay, hkdr, sender, recipient, other } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");
      await hkdr.connect(sender).approve(await remicoPay.getAddress(), amount);
      await remicoPay.connect(sender).createRemittance(recipient.address, amount);

      await expect(
        remicoPay.connect(other).refundRemittance(0)
      ).to.be.revertedWithCustomError(remicoPay, "OwnableUnauthorizedAccount");
    });
  });

  // ─── Admin Functions ──────────────────────────────────────────────

  describe("Admin Functions", function () {
    it("should allow owner to update exchange rate", async function () {
      const { remicoPay, owner } = await loadFixture(deployFixture);
      const newRate = 8_000_000n;
      await expect(remicoPay.connect(owner).setExchangeRate(newRate))
        .to.emit(remicoPay, "ExchangeRateUpdated")
        .withArgs(EXCHANGE_RATE, newRate);
      expect(await remicoPay.exchangeRate()).to.equal(newRate);
    });

    it("should revert on zero exchange rate", async function () {
      const { remicoPay, owner } = await loadFixture(deployFixture);
      await expect(remicoPay.connect(owner).setExchangeRate(0))
        .to.be.revertedWithCustomError(remicoPay, "InvalidRate");
    });

    it("should allow owner to update fee", async function () {
      const { remicoPay, owner } = await loadFixture(deployFixture);
      await expect(remicoPay.connect(owner).setFeeBps(100))
        .to.emit(remicoPay, "FeeBpsUpdated")
        .withArgs(FEE_BPS, 100);
      expect(await remicoPay.feeBps()).to.equal(100);
    });

    it("should revert on fee > 10%", async function () {
      const { remicoPay, owner } = await loadFixture(deployFixture);
      await expect(remicoPay.connect(owner).setFeeBps(1001))
        .to.be.revertedWithCustomError(remicoPay, "InvalidFee");
    });

    it("should reject non-owner admin calls", async function () {
      const { remicoPay, other } = await loadFixture(deployFixture);
      await expect(remicoPay.connect(other).setExchangeRate(1))
        .to.be.revertedWithCustomError(remicoPay, "OwnableUnauthorizedAccount");
      await expect(remicoPay.connect(other).setFeeBps(1))
        .to.be.revertedWithCustomError(remicoPay, "OwnableUnauthorizedAccount");
    });
  });

  // ─── Full Flow (Integration) ──────────────────────────────────────

  describe("Full Remittance Flow", function () {
    it("should complete full send → complete flow", async function () {
      const { remicoPay, hkdr, phpc, sender, recipient, owner } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("5000");

      // 1. Sender approves
      await hkdr.connect(sender).approve(await remicoPay.getAddress(), amount);

      // 2. Sender creates remittance
      await remicoPay.connect(sender).createRemittance(recipient.address, amount);

      // 3. Verify HKDR locked in contract
      expect(await hkdr.balanceOf(await remicoPay.getAddress())).to.equal(amount);

      // 4. Owner completes (simulates off-ramp)
      await remicoPay.connect(owner).completeRemittance(0);

      // 5. Verify PHPC received by recipient
      const [expectedPhp] = await remicoPay.getQuote(amount);
      // Note: getQuote uses current rate, which matches since we haven't changed it
      expect(await phpc.balanceOf(recipient.address)).to.be.gt(0);

      // 6. Verify status
      const remit = await remicoPay.getRemittance(0);
      expect(remit.status).to.equal(1); // Completed
    });

    it("should handle multiple remittances", async function () {
      const { remicoPay, hkdr, sender, recipient, owner } = await loadFixture(deployFixture);

      // Create 3 remittances
      const amounts = [100n, 200n, 300n].map(a => ethers.parseEther(a.toString()));
      const total = amounts.reduce((a, b) => a + b, 0n);
      await hkdr.connect(sender).approve(await remicoPay.getAddress(), total);

      for (const amount of amounts) {
        await remicoPay.connect(sender).createRemittance(recipient.address, amount);
      }

      expect(await remicoPay.nextRemitId()).to.equal(3);

      // Complete first, refund second, leave third pending
      await remicoPay.connect(owner).completeRemittance(0);
      await remicoPay.connect(owner).refundRemittance(1);

      expect((await remicoPay.getRemittance(0)).status).to.equal(1); // Completed
      expect((await remicoPay.getRemittance(1)).status).to.equal(2); // Refunded
      expect((await remicoPay.getRemittance(2)).status).to.equal(0); // Pending
    });
  });
});
