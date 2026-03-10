# RemicoPay

**Website:** [https://remico-pay.vercel.app/](https://remico-pay.vercel.app/)

**Intro Video:** [https://www.youtube.com/watch?v=tAegT-x0gxA](https://www.youtube.com/watch?v=tAegT-x0gxA)

**Demo Video:** [https://youtu.be/LzJN1aWkbAc](https://youtu.be/LzJN1aWkbAc)

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

1.  **User deposits HKD** via FPS or wallet (HKDR stablecoin).
2.  **HKD converts to HKMA-Licensed stablecoin** (on-chain).
3.  **HKMA-Licensed stablecoin swaps to PHPC/IDRT** at a locked exchange rate.
4.  **Local partner** (e.g., Coins.ph) pays out to the recipient's bank account.

## ✨ Key Features

### 📅 Scheduled Remittance + Yield

Users can **schedule future transfers** and earn yield while they wait — reducing or even eliminating fees entirely.

- **Schedule ahead**: Pick a future date; funds are deposited into an ERC-4626 yield vault.
- **Earn yield**: Deposited HKDR generates yield until execution day.
- **Fee offset**: 70% of earned yield is applied to offset the remittance fee. If yield exceeds the fee, the surplus is added to the transfer amount — the recipient gets more.
- **Recurring transfers**: Optionally set monthly recurring schedules (day 1-28).
- **Keeper-compatible**: Anyone can execute a due schedule (designed for off-chain keepers).
- **Full control**: Cancel anytime and get your deposit + earned yield back.

**Contracts:** `SimpleYieldVault.sol` (ERC-4626 vault), `ScheduledRemittance.sol`

### 🏦 FPS Payment Integration

Users without crypto wallets can now send remittances using **Hong Kong's Faster Payment System (FPS)** — bridging traditional banking to blockchain.

- **No HKDR needed**: Pay via FPS bank transfer instead of holding stablecoins.
- **On-chain record**: A pending remittance is created on-chain with the FPS reference number.
- **Semi-automatic verification**: Backend operator confirms FPS receipt → marks payment as verified on-chain → PHPC is minted to recipient.
- **Full transparency**: Every FPS-backed remittance has an on-chain audit trail.

**Contracts:** `FPSVerifier.sol` (operator-confirmed payment verification), `IPaymentVerifier.sol` (interface)

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
- `RemicoPay.sol`: Core remittance logic (instant + FPS flows).
- `ScheduledRemittance.sol`: Scheduled transfers with ERC-4626 yield vault integration.
- `SimpleYieldVault.sol`: ERC-4626 mock vault — deposits earn yield that offsets fees.
- `FPSVerifier.sol`: Semi-automatic FPS payment verification (operator-confirmed).
- `IPaymentVerifier.sol`: Interface for pluggable payment verification backends.
- `MockHKDR.sol`: Mock HKD stablecoin with faucet for testing.
- `MockPHPC.sol`: Mock PHP stablecoin with multi-minter support.

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

## 🧪 Quick Test Guide

**1. Setup Wallet (Etherlink Testnet)**
- Make sure your MetaMask network is **Etherlink Shadownet Testnet**.
- Get free testnet gas from the [Etherlink Faucet](https://faucet.etherlink.com/).
- Import these tokens to see your balances:
  - **MockHKDR:** `0xB4f813F56Fcb34048b7d1ac508153060577Df421`
  - **MockPHPC:** `0x88a4dd63451089Ca1c86dF29E8258301De1cB3d0`

**2. Get Test HKDR**
- Connect to `http://localhost:3000`.
- Click **"HKDR Faucet"** in the top navigation bar to mint **10,000 HKDR**.

**3. Try a Remittance**
- Go to the **Send** page.
- Choose **Wallet (HKDR)** to see the smart contract instantly lock HKDR & mint PHPC.
- *Or* choose **FPS Transfer** to see a simulated "Pending" payment awaiting real-world bank verification.

---

## 🛠 Tech Stack

- **Blockchain:** Etherlink (L2 on Tezos)
- **Smart Contracts:** Solidity, Hardhat
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Wallet Connection:** RainbowKit

---

## 🏗 Technical Architecture

### System Overview

RemicoPay is a monorepo with two layers: an **on-chain smart contract backend** deployed on Etherlink (an EVM-compatible L2 on Tezos) and a **Next.js 14 frontend** that interacts with contracts via Wagmi/Viem.

### Smart Contract Layer (`contracts/`)

All contracts are written in **Solidity 0.8.24**, compiled with Hardhat (optimizer enabled, 200 runs), and use **OpenZeppelin** for access control, reentrancy protection, and ERC standards.

**Core Contracts:**

- **`RemicoPay.sol`** — The central escrow-based remittance contract. Handles two flows:
  - *Instant settlement* — Locks sender's HKDR, deducts fee (basis points), converts at a locked exchange rate (scaled 1e6), and mints PHPC to the recipient in a single transaction.
  - *FPS-backed settlement* — Creates a pending on-chain remittance linked to an FPS reference hash. Settlement completes only after `FPSVerifier` confirms the off-chain payment.
  - Uses CEI (Checks-Effects-Interactions) pattern, `ReentrancyGuard`, and `SafeERC20`.

- **`ScheduledRemittance.sol`** — Enables future-dated transfers with yield. User's HKDR is deposited into an ERC-4626 vault; vault shares are held until the scheduled date. On execution, yield is split 70/30 (user/protocol) and the user's share offsets the remittance fee. Supports recurring schedules (day 1–28) and a keeper-compatible `executeRemittance()` callable by anyone.

- **`SimpleYieldVault.sol`** — An ERC-4626 tokenized vault (`ryHKDR` shares) backed by HKDR. In demo mode, yield is injected by the owner via `addYield()`. Designed to be swapped for a real DeFi vault in production.

- **`FPSVerifier.sol`** — Implements `IPaymentVerifier`. Authorized operators (backend service) call `confirmPayment()` after verifying FPS bank receipt off-chain. `RemicoPay` queries `isPaymentVerified()` before completing FPS remittances.

- **`IPaymentVerifier.sol`** — Pluggable interface for payment verification backends, enabling future adapters beyond FPS.

- **`MockHKDR.sol` / `MockPHPC.sol`** — Test stablecoins with faucet and multi-minter support.

**Contract Interaction Flow:**

```
User → HKDR.approve() → RemicoPay.createRemittance()
       ├─ HKDR.transferFrom(user → contract)
       └─ PHPC.mint(recipient)

User → FPS Bank Transfer → Backend confirms → FPSVerifier.confirmPayment()
       → Owner → RemicoPay.completeRemittanceWithFPS()
         └─ PHPC.mint(recipient)

User → HKDR.approve() → ScheduledRemittance.scheduleRemittance()
       ├─ HKDR → SimpleYieldVault.deposit() → ryHKDR shares
       └─ (on scheduled date) Keeper → executeRemittance()
          ├─ vault.redeem() → HKDR + yield
          ├─ yield offsets fee
          └─ PHPC.mint(recipient)
```

### Frontend Layer (`frontend/`)

Built with **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**.

**Key Architecture:**

- **Wallet Integration** — RainbowKit + Wagmi + Viem, configured for Etherlink Shadownet Testnet (chain ID `127823`). Custom chain defined via `defineChain()` in `lib/wagmi.ts`.
- **Contract Bindings** — `lib/contracts.ts` exports deployed addresses, ABIs (from Hardhat artifacts), and on-chain constants (`RATE_SCALE`, `FEE_BPS`, `FAUCET_AMOUNT`).
- **App Routes:**
  - `/` — Landing page with exchange calculator, features, and protocol info
  - `/send` — Instant remittance flow
  - `/schedule` — Schedule a future transfer
  - `/my-schedules` — View and manage scheduled remittances
  - `/history` — Transaction history
  - `/status` — Remittance status tracking
- **Component Architecture** — Organized into `components/home/`, `components/features/`, `components/layout/`, and `components/ui/` (reusable primitives including animated beams, aurora backgrounds, and bento grids).

### Network Configuration

- **Testnet:** Etherlink Shadownet (chain ID `127823`, RPC `https://node.shadownet.etherlink.com`)
- **Mainnet:** Etherlink Mainnet (chain ID `42793`, RPC `https://node.mainnet.etherlink.com`)
- **Explorer:** `https://shadownet.explorer.etherlink.com` (testnet)
