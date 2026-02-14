# RemicoPay MVP — 1 天內在 Etherlink Testnet 上構建

## 目標
構建一個可運行的原型，展示 HKD → PHP 匯款流程，部署在 Etherlink 測試網上，具備錢包連接和鏈上交易功能，前端可部署到 Vercel。

## Etherlink 測試網資訊
- RPC: `https://node.ghostnet.etherlink.com`
- Chain ID: `128123`
- 區塊瀏覽器: `https://testnet.explorer.etherlink.com`
- 水龍頭（領測試幣）: `https://faucet.etherlink.com/`
- 原生代幣: XTZ（用於支付 gas）
- 支援: Solidity、Hardhat、標準 EVM 工具鏈

## 架構設計

### 智能合約（Solidity / Hardhat）
1. `MockHKDR.sol` — ERC20 模擬港元穩定幣（Demo 用）
2. `MockPHPC.sol` — ERC20 模擬菲律賓比索穩定幣（Demo 用）
3. `RemicoPay.sol` — 核心匯款合約：
   - `getQuote(uint256 hkdAmount)` → 返回 PHP 金額 + 手續費
   - `createRemittance(address recipient, uint256 amount)` → 鎖定 HKDR，觸發事件
   - `completeRemittance(uint256 remitId)` → 釋放 PHPC 到收款人（模擬 off-ramp）
   - `getRemittance(uint256 remitId)` → 查看匯款狀態
   - 儲存匯率（管理員可設定）、手續費率（0.7%）

### 前端（Next.js 14 + React 18 + wagmi + RainbowKit）
4 個頁面：
1. **首頁/報價** — 輸入 HKD 金額 → 即時顯示 PHP 轉換金額 + 費用明細
   - Hero 區域帶粒子/漸層動畫背景
   - 匯率計算器帶即時數字滾動動效
2. **發送匯款** — 連接錢包 → 授權 HKDR → 創建匯款交易
   - 多步驟表單（Stepper UI），每步帶滑入過渡動畫
   - 交易確認帶 confetti 慶祝動效
3. **交易狀態** — 查看匯款狀態，附帶區塊瀏覽器 tx hash 連結
   - 即時進度條動畫（Pending → Processing → Completed）
4. **歷史記錄** — 顯示已連接錢包的所有匯款記錄
   - 卡片列表帶 staggered fade-in 動畫

### 視覺 / 動效設計
- **Framer Motion** — 頁面切換過渡、元素入場動畫、hover 微交互
- **Tailwind Animate** — CSS 動畫工具類（pulse、bounce、fade-in）
- **React CountUp** — 匯率數字滾動動效
- **Canvas Confetti** — 匯款成功慶祝動效
- **漸層主題** — 紫→藍→青的品牌漸層色，搭配玻璃擬態（glassmorphism）卡片
- **深色模式** — 預設深色主題，更有科技感

### 技術棧
- 合約: Hardhat + Solidity 0.8.24 + OpenZeppelin
- 前端: Next.js 14 (App Router) + React 18 + TypeScript + TailwindCSS + shadcn/ui
- 動效: Framer Motion + React CountUp + Canvas Confetti
- 錢包: RainbowKit + wagmi v2 + viem
- 部署: Vercel（前端）+ Hardhat deploy（合約）

## 團隊分工（3 人，約 10 小時）

### 成員 A — 智能合約 + 鏈上整合
1. 編寫 3 個 Solidity 合約（MockHKDR、MockPHPC、RemicoPay）
2. 編寫 Hardhat 测試，確保編譯 + 测試通過
3. 配置 hardhat.config.ts，寫部署腳本 deploy.ts
4. 部署合約到 Etherlink Testnet
5. 導出合約 ABI + 地址，提供給前端使用

### 成員 B — 前端頁面 + 動效
1. 初始化 Next.js 項目（TailwindCSS + shadcn/ui + Framer Motion）
2. 製作全局 Layout（導航欄 + 深色主題 + 漸層背景）
3. 製作首頁 Hero 區域（動畫背景 + 標題 + CTA 按鈕）
4. 製作匯率計算器組件（輸入 HKD → 顯示 PHP + 費用明細 + CountUp 數字滾動）
5. 製作發送匯款頁面 UI（多步驟 Stepper + 表單 + 動畫過渡）
6. 製作交易狀態頁面 UI（進度條 + 狀態卡片）
7. 製作歷史記錄頁面 UI（卡片列表 + staggered fade-in）
8. Confetti 慶祝動效（匯款成功時觸發）

### 成員 C — 前端錢包 + 合約串接 + 部署
1. 配置 wagmi + RainbowKit + Etherlink Testnet 鏈配置
2. 寫 ConnectWallet 組件（連接 MetaMask、自動添加 Etherlink 網絡）
3. 寫 Mint HKDR 水龍頭組件（調用合約 faucet 函數領测試幣）
4. 寫 Approve + CreateRemittance 交易流程（調用合約，處理 tx 狀態）
5. 寫匯款狀態查詢（調用 getRemittance，顯示鏈上數據）
6. 寫歷史記錄查詢（讀取合約事件日誌）
7. 前端部署到 Vercel
8. 端到端测試（全流程走一遍確認無報錯）

### 協作流程
- 成員 A 先行，合約寫好 + 部署後導出 ABI
- 成員 B 同步開工，用 mock 數據先做 UI
- 成員 C 等 A 導出 ABI + B 完成頁面後，串接合約與 UI
- 最後成員 C 部署 Vercel + 全流程测試

## 文件結構
```
remitcircle/
├── contracts/              # Hardhat 項目
│   ├── contracts/
│   │   ├── MockHKDR.sol    # 模擬港元穩定幣
│   │   ├── MockPHPC.sol    # 模擬菲律賓比索穩定幣
│   │   └── RemicoPay.sol   # 核心匯款合約
│   ├── scripts/
│   │   └── deploy.ts       # 部署腳本
│   ├── test/
│   │   └── RemicoPay.test.ts
│   └── hardhat.config.ts
├── frontend/               # Next.js 應用
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # 首頁 + 報價
│   │   ├── send/page.tsx     # 發送匯款
│   │   ├── status/page.tsx   # 交易狀態追蹤
│   │   └── history/page.tsx  # 歷史記錄
│   ├── components/
│   ├── lib/
│   │   ├── contracts.ts      # ABI + 合約地址
│   │   └── wagmi.ts          # 鏈配置
│   └── package.json
└── README.md
```

## 核心 Demo 流程
1. 用戶連接 MetaMask（自動添加 Etherlink 測試網）
2. 用戶領取測試用 HKDR 代幣（UI 內水龍頭按鈕）
3. 用戶輸入 HKD 金額 → 即時看到 PHP 報價 + 0.7% 手續費
4. 用戶授權 HKDR 支出 → 確認匯款交易
5. 合約鎖定 HKDR，觸發 RemittanceCreated 事件
6. 狀態頁面顯示交易已在 Etherlink 區塊瀏覽器上確認
7. （模擬）後端完成匯款 → PHPC 釋放到收款人

這證明了鏈上流程可行。鏈下部分（FPS、Coins.ph 對接）在 Pitch 中解釋為「Phase 2 整合」。
