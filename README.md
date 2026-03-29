# 股市資訊平台

追蹤市場重要人士動態，掌握每日財經重點。

**網站：** https://stockinfo-notes.vercel.app

---

## 功能

- **KOL 影片筆記** — 自動抓取 YouTube 財經頻道最新影片，由 AI 生成繁體中文摘要
- **每日財經摘要** — AI 每天整理 10 大財經重點，台灣時間 09:00 自動更新
- **登入系統** — 使用 Clerk 提供用戶登入/註冊
- **管理後台** — 僅限管理員存取，可管理 KOL 資料與內容
- **深色模式** — 支援 Light / Dark 切換

---

## 技術架構

| 項目 | 技術 |
|------|------|
| 前端框架 | Next.js 15 (App Router) |
| 資料庫 | Neon PostgreSQL + Drizzle ORM |
| 身份驗證 | Clerk |
| AI 摘要 | Google Gemini API |
| 部署 | Vercel |

---

## 本地開發

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 並填入對應的值：

```bash
cp .env.example .env.local
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000)

---

## 環境變數

詳見 `.env.example`

| Key | 說明 |
|-----|------|
| `DATABASE_URL` | Neon PostgreSQL 連線字串 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key |
| `CLERK_SECRET_KEY` | Clerk Secret Key |
| `GEMINI_API_KEY` | Google Gemini API Key |
| `CRON_SECRET` | Cron job 驗證密碼 |
| `ADMIN_EMAIL` | 管理員 Email |

---

## Cron Jobs

| 路徑 | 排程 | 說明 |
|------|------|------|
| `/api/cron/fetch-kol` | 每天 08:00 | 抓取 KOL 最新影片並生成 AI 摘要 |
| `/api/cron/fetch-news` | 每天 01:00 | 抓取財經新聞並生成每日摘要 |
