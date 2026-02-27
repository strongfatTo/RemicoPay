import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "XTZ");

  const EXCHANGE_RATE = 7_350_000; // 7.35 PHP per HKD (scaled by 1e6)
  const FEE_BPS = 70;              // 0.7%

  // ─── 1. Deploy MockHKDR ────────────────────────────────────────────
  console.log("\n1. Deploying MockHKDR...");
  const MockHKDR = await ethers.getContractFactory("MockHKDR");
  const hkdr = await MockHKDR.deploy();
  await hkdr.waitForDeployment();
  const hkdrAddr = await hkdr.getAddress();
  console.log("   MockHKDR deployed:", hkdrAddr);

  // ─── 2. Deploy MockPHPC ────────────────────────────────────────────
  console.log("\n2. Deploying MockPHPC...");
  const MockPHPC = await ethers.getContractFactory("MockPHPC");
  const phpc = await MockPHPC.deploy();
  await phpc.waitForDeployment();
  const phpcAddr = await phpc.getAddress();
  console.log("   MockPHPC deployed:", phpcAddr);

  // ─── 3. Deploy RemicoPay ───────────────────────────────────────────
  console.log("\n3. Deploying RemicoPay...");
  const RemicoPay = await ethers.getContractFactory("RemicoPay");
  const remicoPay = await RemicoPay.deploy(hkdrAddr, phpcAddr, EXCHANGE_RATE, FEE_BPS);
  await remicoPay.waitForDeployment();
  const remicoPayAddr = await remicoPay.getAddress();
  console.log("   RemicoPay deployed:", remicoPayAddr);

  // ─── 4. Deploy SimpleYieldVault (ERC-4626) ────────────────────────
  console.log("\n4. Deploying SimpleYieldVault...");
  const SimpleYieldVault = await ethers.getContractFactory("SimpleYieldVault");
  const vault = await SimpleYieldVault.deploy(hkdrAddr);
  await vault.waitForDeployment();
  const vaultAddr = await vault.getAddress();
  console.log("   SimpleYieldVault deployed:", vaultAddr);

  // ─── 5. Deploy ScheduledRemittance ─────────────────────────────────
  console.log("\n5. Deploying ScheduledRemittance...");
  const ScheduledRemittance = await ethers.getContractFactory("ScheduledRemittance");
  const scheduled = await ScheduledRemittance.deploy(
    hkdrAddr,
    phpcAddr,
    vaultAddr,
    deployer.address,  // treasury = deployer for demo
    EXCHANGE_RATE,
    FEE_BPS
  );
  await scheduled.waitForDeployment();
  const scheduledAddr = await scheduled.getAddress();
  console.log("   ScheduledRemittance deployed:", scheduledAddr);

  // ─── 6. Deploy FPSVerifier ─────────────────────────────────────────
  console.log("\n6. Deploying FPSVerifier...");
  const FPSVerifier = await ethers.getContractFactory("FPSVerifier");
  const fpsVerifier = await FPSVerifier.deploy();
  await fpsVerifier.waitForDeployment();
  const fpsVerifierAddr = await fpsVerifier.getAddress();
  console.log("   FPSVerifier deployed:", fpsVerifierAddr);

  // ─── 7. Configure permissions ──────────────────────────────────────
  console.log("\n7. Configuring permissions...");

  // Set RemicoPay as PHPC minter
  let tx = await phpc.setMinter(remicoPayAddr);
  await tx.wait();
  console.log("   PHPC minter: RemicoPay ✓");

  // Set ScheduledRemittance as PHPC minter
  tx = await phpc["setMinter(address)"](scheduledAddr);
  await tx.wait();
  console.log("   PHPC minter: ScheduledRemittance ✓");

  // Set FPSVerifier as payment verifier for RemicoPay
  tx = await remicoPay.setPaymentVerifier(fpsVerifierAddr);
  await tx.wait();
  console.log("   RemicoPay payment verifier: FPSVerifier ✓");

  // ─── Summary ───────────────────────────────────────────────────────
  console.log("\n" + "═".repeat(60));
  console.log("  DEPLOYMENT COMPLETE");
  console.log("═".repeat(60));
  console.log(`  MockHKDR:             ${hkdrAddr}`);
  console.log(`  MockPHPC:             ${phpcAddr}`);
  console.log(`  RemicoPay:            ${remicoPayAddr}`);
  console.log(`  SimpleYieldVault:     ${vaultAddr}`);
  console.log(`  ScheduledRemittance:  ${scheduledAddr}`);
  console.log(`  FPSVerifier:          ${fpsVerifierAddr}`);
  console.log(`  Exchange Rate: ${EXCHANGE_RATE / 1e6} PHP/HKD`);
  console.log(`  Fee: ${FEE_BPS / 100}%`);
  console.log("═".repeat(60));
  console.log("\nUpdate frontend/lib/contracts.ts with these addresses!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
