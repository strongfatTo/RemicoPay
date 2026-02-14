import { http, createConfig } from "wagmi";
import { etherlinkTestnet } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
    appName: "RemicoPay",
    projectId: "3a8170812b534d0ff9d794f19a901d64", // Public Project ID for testing
    chains: [etherlinkTestnet],
    transports: {
        [etherlinkTestnet.id]: http(),
    },
    ssr: true,
});
