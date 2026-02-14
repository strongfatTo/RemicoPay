import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "XTZ");

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
  const EXCHANGE_RATE = 7_350_000; // 7.35 PHP per HKD (scaled by 1e6)
  const FEE_BPS = 70;              // 0.7%

  const RemicoPay = await ethers.getContractFactory("RemicoPay");
  const remicoPay = await RemicoPay.deploy(hkdrAddr, phpcAddr, EXCHANGE_RATE, FEE_BPS);
  await remicoPay.waitForDeployment();
  const remicoPayAddr = await remicoPay.getAddress();
  console.log("   RemicoPay deployed:", remicoPayAddr);

  // ─── 4. Configure MockPHPC minter ─────────────────────────────────
  console.log("\n4. Setting RemicoPay as PHPC minter...");
  const setMinterTx = await phpc.setMinter(remicoPayAddr);
  await setMinterTx.wait();
  console.log("   PHPC minter set to RemicoPay");

  // ─── Summary ───────────────────────────────────────────────────────
  console.log("\n" + "═".repeat(60));
  console.log("  DEPLOYMENT COMPLETE");
  console.log("═".repeat(60));
  console.log(`  MockHKDR:   ${hkdrAddr}`);
  console.log(`  MockPHPC:   ${phpcAddr}`);
  console.log(`  RemicoPay:  ${remicoPayAddr}`);
  console.log(`  Exchange Rate: ${EXCHANGE_RATE / 1e6} PHP/HKD`);
  console.log(`  Fee: ${FEE_BPS / 100}%`);
  console.log("═".repeat(60));
  console.log("\nUpdate frontend/lib/contracts.ts with these addresses!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
