@AGENTS.md

## 專案基本資訊
- 網站名稱：股市資訊平台
- 線上網址：https://stockinfo-notes.vercel.app
- GitHub：https://github.com/jenda416-dev/stock-information-platform
- 管理員：jenda416@gmail.com

## 技術規則
- 資料庫用 Drizzle ORM，不要用 raw SQL
- 身份驗證用 Clerk，不要用其他套件
- Server component 用 `currentUser()` 取得用戶資料，不要在 middleware 做 email 判斷
- `ADMIN_EMAIL` 存在環境變數，不要寫死在代碼裡
- Next.js 16 用 `proxy.ts` 取代 `middleware.ts`（breaking change），不要建立 `middleware.ts`
- Yahoo Finance API 用 `range=7d&interval=1d`，不要用 `range=5d`（加密貨幣 24/7 交易，5d 有時抓不到本週一的資料）

## Commit 規範
- 格式：`feat:` / `fix:` / `docs:` / `style:` / `refactor:`
- 訊息用中文描述功能，例如：`feat: 新增 KOL 篩選功能`

## 工程規範
- 單一檔案不超過 1000 行，超過要拆分成更小的元件檔案並 import
- 禁止使用 Lorem Ipsum 或假佔位內容，每個元素都必須有實際意義
- 行動裝置觸碰目標（按鈕、連結）至少 44px

## UI 規則
- 所有文字顯示用繁體中文
- 支援 dark mode，樣式用 Tailwind CSS
- UI 元件放在 `components/ui/`，使用 shadcn 已有的元件，不要自己重寫
- Section 標題用左側 primary 色條 accent bar：`<div className="w-0.5 h-5 rounded-full bg-primary" />`
- 卡片 hover 效果只用 `hover:shadow-md transition-all duration-200`，不加位移（`-translate-y-*`）或 `shadow-xl`
- 卡片左側色條用 `border-l-4`，顏色依漲跌方向（紅/綠/預設）
- 卡片頂部加 1px gradient glow line（`h-px bg-gradient-to-r from-transparent via-*/50 to-transparent`）
- Tags 樣式：`text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide`，不用 `bg-blue-*` 或 inline style border
- CTA 按鈕用 solid primary（`bg-primary text-primary-foreground`），不用 outline 或 ghost
- 不使用 emoji 作為 icon，改用 SVG

## 版面寬度規則
- Nav 與首頁內容統一用 `max-w-5xl mx-auto px-4`
- 次頁面（`/kol`、`/news`、`/earnings` 等）用 `max-w-2xl mx-auto px-4`
- 新增頁面或修改 nav 時需確認寬度一致

## Cron Jobs 規則
- 所有 cron route 須驗證 `Authorization: Bearer <CRON_SECRET>`，未通過回傳 401
- 排程設定在 `vercel.json`，新增 cron route 要同步更新該檔案

## 市場資料規則
- 台股顏色慣例：紅色 = 上漲，綠色 = 下跌（與歐美相反）
- 本週漲跌幅以「本週第一個有效交易日收盤價」為基準（非 `previousClose`）；用 UTC `thisMondayMs` 做邊界，`findIndex(ts >= thisMondayMs)` 找第一筆有效資料，假期週同樣適用

