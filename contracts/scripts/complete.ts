import { ethers } from "hardhat";

/**
 * Complete a pending remittance (owner only).
 *
 * Usage:
 *   npx hardhat run scripts/complete.ts --network etherlinkTestnet
 *
 * Set the REMIT_ID env variable to choose which remittance to complete:
 *   $env:REMIT_ID = "0"
 *   npx hardhat run scripts/complete.ts --network etherlinkTestnet
 *
 * Or complete ALL pending remittances:
 *   $env:REMIT_ID = "all"
 *   npx hardhat run scripts/complete.ts --network etherlinkTestnet
 */

const REMICOPAY_ADDRESS = "0x707Cae977bc4346c35bfD802090429dA504fE435";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  const remicoPay = await ethers.getContractAt("RemicoPay", REMICOPAY_ADDRESS, owner);
  const nextId = await remicoPay.nextRemitId();
  console.log("Total remittances created:", nextId.toString());

  if (nextId === 0n) {
    console.log("No remittances exist yet.");
    return;
  }

  const remitIdEnv = process.env.REMIT_ID ?? "all";

  if (remitIdEnv.toLowerCase() === "all") {
    // Complete ALL pending remittances
    console.log("\nScanning all remittances...\n");
    let completed = 0;

    for (let i = 0n; i < nextId; i++) {
      const remit = await remicoPay.getRemittance(i);
      // Status: 0 = Pending, 1 = Completed, 2 = Refunded
      if (remit.status === 0n) {
        console.log(`  Remittance #${i}: Pending — completing...`);
        console.log(`    Sender:    ${remit.sender}`);
        console.log(`    Recipient: ${remit.recipient}`);
        console.log(`    HKD:       ${ethers.formatEther(remit.hkdAmount)} HKDR`);
        console.log(`    PHP:       ${ethers.formatEther(remit.phpAmount)} PHPC`);

        const tx = await remicoPay.completeRemittance(i);
        await tx.wait();
        console.log(`    ✓ Completed! Tx: ${tx.hash}\n`);
        completed++;
      } else {
        const statusLabel = remit.status === 1n ? "Completed" : "Refunded";
        console.log(`  Remittance #${i}: ${statusLabel} — skipping`);
      }
    }

    console.log(`\nDone. Completed ${completed} remittance(s).`);
  } else {
    // Complete a specific remittance
    const remitId = BigInt(remitIdEnv);
    console.log(`\nCompleting remittance #${remitId}...`);

    const remit = await remicoPay.getRemittance(remitId);
    if (remit.status !== 0n) {
      const statusLabel = remit.status === 1n ? "Completed" : "Refunded";
      console.log(`Remittance #${remitId} is already ${statusLabel}.`);
      return;
    }

    console.log(`  Sender:    ${remit.sender}`);
    console.log(`  Recipient: ${remit.recipient}`);
    console.log(`  HKD:       ${ethers.formatEther(remit.hkdAmount)} HKDR`);
    console.log(`  PHP:       ${ethers.formatEther(remit.phpAmount)} PHPC`);

    const tx = await remicoPay.completeRemittance(remitId);
    await tx.wait();
    console.log(`\n✓ Completed! PHPC minted to ${remit.recipient}`);
    console.log(`  Tx: ${tx.hash}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
