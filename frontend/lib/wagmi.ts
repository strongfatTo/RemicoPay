import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

// ----- Etherlink Testnet chain definition -----
export const etherlinkTestnet = defineChain({
  id: 127823,
  name: "Etherlink Shadownet Testnet",
  nativeCurrency: { name: "XTZ", symbol: "XTZ", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://node.shadownet.etherlink.com"] },
  },
  blockExplorers: {
    default: {
      name: "Etherlink Explorer",
      url: "https://shadownet.explorer.etherlink.com",
    },
  },
  testnet: true,
});

// ----- Wagmi + RainbowKit config -----
export const config = getDefaultConfig({
  appName: "RemicoPay",
  projectId: "REMICOPAY_DEMO", // WalletConnect projectId — replace with real one for production
  chains: [etherlinkTestnet],
  ssr: true,
});
