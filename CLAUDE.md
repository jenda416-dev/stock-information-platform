@AGENTS.md
@DESIGN.md

## 專案基本資訊
- 網站名稱：股市資訊平台
- 線上網址：https://stockinfo-notes.vercel.app
- GitHub：https://github.com/jenda416-dev/stock-information-platform
- 管理員：jenda416@gmail.com

## 技術規則
- 資料庫用 Firebase Admin SDK（Firestore），import 從 `@/lib/firebase/admin`，型別定義在 `@/lib/firebase/collections`，不要用 raw Firestore REST API
- **身份驗證：目前無身份驗證，所有頁面公開存取**；Clerk 套件雖裝著但未啟用，如需加回驗證請先確認
- `ADMIN_EMAIL` 存在環境變數，不要寫死在代碼裡
- Yahoo Finance API 用 `range=7d&interval=1d`，不要用 `range=5d`（加密貨幣 24/7 交易，5d 有時抓不到本週一的資料）
- CSS 框架是 **Tailwind v4**，沒有 `tailwind.config.js`；設定在 `app/globals.css` 的 `@import "tailwindcss"`，不要套用 v3 的 `theme()` 或獨立 `@apply` 寫法
- TTS 音檔存 **Vercel Blob**（`BLOB_READ_WRITE_TOKEN`），不要存 Firebase Storage

## Commit 規範
- 格式：`feat:` / `fix:` / `docs:` / `style:` / `refactor:`
- 訊息用中文描述功能，例如：`feat: 新增 KOL 篩選功能`

## 工程規範
- 單一檔案不超過 1000 行，超過要拆分成更小的元件檔案並 import
- 禁止使用 Lorem Ipsum 或假佔位內容，每個元素都必須有實際意義
- 行動裝置觸碰目標（按鈕、連結）至少 44px


## Cron Jobs 規則
- 所有 cron route 須驗證 `Authorization: Bearer <CRON_SECRET>`，未通過回傳 401
- 排程設定在 `vercel.json`，新增 cron route 要同步更新該檔案

## 市場資料規則
- 台股顏色慣例：紅色 = 上漲，綠色 = 下跌（與歐美相反）
- 本週漲跌幅以「本週第一個有效交易日收盤價」為基準（非 `previousClose`）；用 UTC `thisMondayMs` 做邊界，`findIndex(ts >= thisMondayMs)` 找第一筆有效資料，假期週同樣適用

## AI 規則
- 使用 **Gemini 2.0-flash**（`@google/generative-ai`），不要自行升降版本
- 新增或修改 Gemini API 呼叫前須先告知使用者（有 API 費用）
- SectionCard 的 `adviceKeyword` 只能是：**買進、加碼、觀察、減碼、避開**，不可用其他詞
- 股票代號格式：台股「公司名 四位數字代號」（例：台積電 2330）；美股「公司名 英文代號」（例：Nvidia NVDA）

## 股癌摘要規則
- Markdown 摘要固定六段結構：**前言 → 影片主旨 → 核心重點 → 潛在標的盤點 → 金句 → Tags**
- `scripts/sync-gooaye.ts` 依賴此結構解析，擅自改動段落標題或順序會破壞同步流程
- Obsidian raw 筆記路徑：`/Users/alexchen/Desktop/Coding Chicken/Obsidian/股癌文字摘要/raw/股癌文字摘要`（移動此路徑需同步更新 script）

