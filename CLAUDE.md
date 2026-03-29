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
