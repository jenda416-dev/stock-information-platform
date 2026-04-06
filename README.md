# 股市資訊平台

追蹤市場重要人士動態，掌握每日財經重點。

**網站：** https://stockinfo-notes.vercel.app  
**GitHub：** https://github.com/jenda416-dev/stock-information-platform

---

## 功能

| 頁面 | 說明 |
|------|------|
| **首頁** | 市場行情總覽 + KOL 最新影片筆記 |
| **KOL 影片筆記** `/kol` | 自動抓取 YouTube 財經頻道，由 AI 生成繁體中文摘要與標籤 |
| **每日財經摘要** `/news` | AI 每天整理 10 大財經重點，台灣時間 09:00 自動更新 |
| **法說會** `/earnings` | 台股法說會行事曆（即將舉行）與摘要（已完成） |
| **管理後台** `/admin` | 僅限管理員，管理 KOL 資料與法說會內容 |
| **登入系統** | Clerk 提供用戶登入 / 註冊 |
| **深色模式** | 支援 Light / Dark 切換 |

---

## 技術架構

| 項目 | 技術 |
|------|------|
| 前端框架 | Next.js 16.2 (App Router, Turbopack) |
| UI 元件 | shadcn/ui + Tailwind CSS v4 |
| 資料庫 | Neon PostgreSQL + Drizzle ORM |
| 身份驗證 | Clerk |
| AI 摘要 | Google Gemini API |
| 部署 | Vercel |

---

## 資料庫 Schema

| 資料表 | 說明 |
|--------|------|
| `kol_persons` | KOL 人物清單（平台、feed URL、頭像） |
| `kol_posts` | KOL 貼文 / 影片（含 AI 摘要、tags） |
| `news_articles` | 抓取的財經新聞原文 |
| `news_digests` | 每日 AI 整理的 10 大重點 |
| `earnings_calls` | 法說會行事曆與摘要 |
| `watched_stocks` | 追蹤中的台股清單 |

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

### 3. 執行資料庫 Migration

```bash
npm run db:migrate
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000)

---

## 環境變數

| Key | 說明 |
|-----|------|
| `DATABASE_URL` | Neon PostgreSQL 連線字串 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key |
| `CLERK_SECRET_KEY` | Clerk Secret Key |
| `GEMINI_API_KEY` | Google Gemini API Key |
| `CRON_SECRET` | Cron job 驗證密碼（Bearer token） |
| `ADMIN_EMAIL` | 管理員 Email（存環境變數，不寫死） |

---

