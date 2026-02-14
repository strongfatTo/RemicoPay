// RemicoPay — Contract ABIs & Addresses
// Auto-generated from Hardhat artifacts. Update addresses after deployment.

import RemicoPayABI from "./RemicoPay.json";
import MockHKDRABI from "./MockHKDR.json";
import MockPHPCABI from "./MockPHPC.json";

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
  MockHKDR: "0xa2712f014199F35e19b0F69f5D33FDdF5c738f10",
  MockPHPC: "0xF5079Dc7F12D32E26855949c1398211DC0BC617c",
  RemicoPay: "0xab9e900912eC429D3bF50deF4658e99e38cc0A8C",
} as const;

// ----- ABIs -----
export { RemicoPayABI, MockHKDRABI, MockPHPCABI };

// ----- Constants (must match contract values) -----
export const RATE_SCALE = 1_000_000n; // 1e6
export const FEE_BPS = 70n; // 0.7 %
export const MAX_FEE_BPS = 1_000n; // 10 %
export const FAUCET_AMOUNT = 10_000n * 10n ** 18n; // 10,000 HKDR
export const FAUCET_COOLDOWN = 3600n; // 1 hour
