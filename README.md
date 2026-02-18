# RemicoPay

**Website:** [https://remico-pay.vercel.app/](https://remico-pay.vercel.app/)

**Intro Video:** [https://www.youtube.com/watch?v=tAegT-x0gxA](https://www.youtube.com/watch?v=tAegT-x0gxA)

> **A blockchain-powered cross-border remittance platform enabling instant, low-cost money transfers from Hong Kong to all over the world (Initial Target: HK to Philipines & HK to Indonesia).**

## 🚩 Problem

Traditional remittance services charge **5-10% fees** and take **1-3 days** to process. Migrant workers sending money home lose significant amounts to fees and delays, impacting their families' livelihoods.

## 💡 Solution

**RemicoPay** uses Hong Kong's **Fast Payment System (FPS)** combined with **stablecoins on Etherlink** to enable:

- ⚡ **12-minute settlement** (vs days with banks)
- 💰 **Below 1% fee** (vs 5-10% traditional)
- 🔗 **On-chain transparency** — every transaction verifiable on blockchain
- 🌏 **HKD → PHP/IDR corridors** — specifically serving Hong Kong's large Filipino & Indonesian worker communities

## ⚙️ How it works

1.  **User deposits HKD** via FPS.
2.  **HKD converts to HKMA-Licensed stablecoin** (on-chain).
3.  **HKMA-Licensed stablecoin swaps to PHPC/IDRT** at a locked exchange rate.
4.  **Local partner** (e.g., Coins.ph) pays out to the recipient's bank account.

## 🎯 Target Market

400,000+ Filipino & Indonesian domestic workers in Hong Kong sending ~$6B annually in remittances.

## 🚀 Differentiator

Combines regulatory compliance (HKMA-ready) with blockchain speed and transparency — **not a crypto app**, but a fintech using crypto rails invisibly.

---

## 📂 Project Structure

This repository is organized as a monorepo containing two main parts:

- **`contracts/`**: The smart contract backend, built with Hardhat.
- **`frontend/`**: The user interface, built with Next.js, React, and Tailwind CSS.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [git](https://git-scm.com/)

---

### 1. Smart Contracts (`/contracts`)

The smart contracts are written in Solidity and managed using Hardhat.

**Setup:**

```bash
cd contracts
npm install
```

**Compilation:**

```bash
npx hardhat compile
```

**Testing:**

```bash
npx hardhat test
```

**Deployment:**

Create a `.env` file in the `contracts` directory with the following variable:

```env
DEPLOYER_PRIVATE_KEY=your_private_key_here
```

Deploy to Etherlink Testnet or Mainnet:

```bash
npx hardhat run scripts/deploy.ts --network etherlinkTestnet
# or
npx hardhat run scripts/deploy.ts --network etherlinkMainnet
```

**Key Contracts:**
- `RemicoPay.sol`: The core remittance logic.
- `MockHKDR.sol`: Mock implementation of HKD stablecoin for testing.
- `MockPHPC.sol`: Mock implementation of PHP stablecoin for testing.

---

### 2. Frontend (`/frontend`)

The frontend is a modern web application built with Next.js 14 (App Router).

**Setup:**

```bash
cd frontend
npm install
```

**Running Locally:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Key Technologies:**
- **Framework:** [Next.js](https://nextjs.org/) & [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Web3:** [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/), [RainbowKit](https://www.rainbowkit.com/)
- **UI Components:** [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)

---

## 🛠 Tech Stack

- **Blockchain:** Etherlink (L2 on Tezos)
- **Smart Contracts:** Solidity, Hardhat
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Wallet Connection:** RainbowKit
