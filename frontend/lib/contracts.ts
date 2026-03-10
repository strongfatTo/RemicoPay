// RemicoPay — Contract ABIs & Addresses
// Auto-generated from Hardhat artifacts. Update addresses after deployment.

import RemicoPayABI from "./RemicoPay.json";
import MockHKDRABI from "./MockHKDR.json";
import MockPHPCABI from "./MockPHPC.json";
import ScheduledRemittanceABI from "./ScheduledRemittance.json";
import SimpleYieldVaultABI from "./SimpleYieldVault.json";
import FPSVerifierABI from "./FPSVerifier.json";

// ----- Etherlink Testnet (ghostnet) -----
export const CHAIN_CONFIG = {
  id: 127823,
  name: "Etherlink Shadownet Testnet",
  rpcUrl: "https://node.shadownet.etherlink.com",
  blockExplorer: "https://shadownet.explorer.etherlink.com",
  nativeCurrency: { name: "XTZ", symbol: "XTZ", decimals: 18 },
} as const;

// ----- Deployed Addresses (update after `npx hardhat run scripts/deploy.ts --network etherlinkTestnet`) -----
export const ADDRESSES = {
  MockHKDR: "0xB4f813F56Fcb34048b7d1ac508153060577Df421",
  MockPHPC: "0x88a4dd63451089Ca1c86dF29E8258301De1cB3d0",
  RemicoPay: "0xC23465B69b7aB17Bfc26134b3617e6E657335232",
  SimpleYieldVault: "0x697d590450F04E1d713A629e00554A3dDA55d368",
  ScheduledRemittance: "0x3fF8bEAa8A51Dd44375FCdF35963d0dB9cC6054e",
  FPSVerifier: "0xE058cbb7DFed9459b952f0B3CF11f6Ec23E00eDb",
} as const;

// ----- ABIs -----
export { RemicoPayABI, MockHKDRABI, MockPHPCABI, ScheduledRemittanceABI, SimpleYieldVaultABI, FPSVerifierABI };

// ----- Constants (must match contract values) -----
export const RATE_SCALE = 1_000_000n; // 1e6
export const FEE_BPS = 70n; // 0.7 %
export const MAX_FEE_BPS = 1_000n; // 10 %
export const FAUCET_AMOUNT = 10_000n * 10n ** 18n; // 10,000 HKDR
export const FAUCET_COOLDOWN = 3600n; // 1 hour
