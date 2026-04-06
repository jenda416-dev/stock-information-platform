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

## Commit 規範
- 格式：`feat:` / `fix:` / `docs:` / `style:` / `refactor:`
- 訊息用中文描述功能，例如：`feat: 新增 KOL 篩選功能`

## UI 規則
- 所有文字顯示用繁體中文
- 支援 dark mode，樣式用 Tailwind CSS
- UI 元件放在 `components/ui/`，使用 shadcn 已有的元件，不要自己重寫

## 版面寬度規則
- Nav 與首頁內容統一用 `max-w-5xl mx-auto px-4`
- 次頁面（`/kol`、`/news`、`/earnings` 等）用 `max-w-2xl mx-auto px-4`
- 新增頁面或修改 nav 時需確認寬度一致

## Cron Jobs 規則
- 所有 cron route 須驗證 `Authorization: Bearer <CRON_SECRET>`，未通過回傳 401
- 排程設定在 `vercel.json`，新增 cron route 要同步更新該檔案

## 資料注意事項
- `kol_posts.platform` 實際值為 `"youtube"`（股癌 Gooaye），schema 中的 comment 尚未更新
- `kol_persons.platform` 欄位的 comment 同樣過時，實際 slug 為 `youtube_gooaye`
