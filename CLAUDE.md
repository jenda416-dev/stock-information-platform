@AGENTS.md
@DESIGN.md

## 專案基本資訊
- 網站名稱：股市資訊平台
- 線上網址：https://stockinfo-notes.vercel.app
- GitHub：https://github.com/jenda416-dev/stock-information-platform
- 管理員：jenda416@gmail.com

## 技術規則
- 資料庫用 Firebase Admin SDK（Firestore），import 從 `@/lib/firebase/admin`，型別定義在 `@/lib/firebase/collections`，不要用 raw Firestore REST API
- 身份驗證用 Clerk，不要用其他套件
- Server component 用 `currentUser()` 取得用戶資料，不要在 middleware 做 email 判斷
- `ADMIN_EMAIL` 存在環境變數，不要寫死在代碼裡
- Yahoo Finance API 用 `range=7d&interval=1d`，不要用 `range=5d`（加密貨幣 24/7 交易，5d 有時抓不到本週一的資料）

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

