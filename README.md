# 股市資訊平台

追蹤財經 KOL 動態，掌握每日財經重點。

**線上版本：** https://stockinfo-notes.vercel.app  
**GitHub：** https://github.com/jenda416-dev/stock-information-platform

---

## 功能

| 頁面 | 說明 |
|------|------|
| `/` | 首頁，市場概覽 + 最新 KOL 影片筆記 |
| `/kol` | KOL 影片筆記列表，支援依人物篩選與分頁 |
| `/kol/[guid]` | 單篇影片的完整 AI 筆記，附音頻播放 |
| `/news` | 每日財經摘要，AI 自動整理重點（每日凌晨 1:00 UTC 更新） |
| **登入系統** | Clerk 提供用戶登入 / 註冊 |
| **深色模式** | 支援 Light / Dark 切換 |

---

## 技術棧

| 項目 | 技術 |
|------|------|
| 前端框架 | Next.js 16.2（App Router） |
| UI | Tailwind CSS v4、shadcn/ui、@base-ui/react |
| 資料庫 | Firebase Firestore（firebase-admin） |
| 身份驗證 | Clerk |
| AI 摘要 | Google Gemini |
| 語音合成 | OpenAI TTS |
| 檔案儲存 | Vercel Blob |
| 部署 | Vercel |

---

## Firebase 資料結構

| Collection | 說明 |
|------------|------|
| `kol_persons` | KOL 人物清單（平台、feed URL、頭像） |
| `kol_posts` | KOL 影片 / 貼文（AI 摘要、tags、sectionCards、audioUrl） |
| `news_digests` | 每日 AI 整理的財經重點 |
| `watched_stocks` | 追蹤中的台股清單 |

---

## 排程任務（Cron Jobs）

由 Vercel Cron 自動觸發，需在 Header 帶入 `Authorization: Bearer <CRON_SECRET>`。

| 路由 | 排程（UTC） | 台灣時間 | 說明 |
|------|------------|---------|------|
| `/api/cron/fetch-kol` | 每日 08:00 | 16:00 | 抓取 KOL YouTube 頻道，Gemini 生成摘要與標籤 |
| `/api/cron/fetch-gooaye` | 週三、週六 08:30 | 16:30 | 同步 Gooaye 平台內容 |
| `/api/cron/fetch-news` | 每日 01:00 | 09:00 | 彙整每日財經重點摘要 |

---

## 專案結構

```
app/
├── (pages)/            # 各頁面路由（kol、news）
└── api/
    ├── cron/           # 排程任務 API
    ├── kol/            # KOL 資料 API
    ├── market/         # 市場資料 API
    └── news/           # 新聞資料 API

components/
├── kol/                # KOL 相關元件
├── market/             # 市場資料元件
├── news/               # 新聞元件
└── ui/                 # shadcn/ui 基礎元件

lib/
├── ai/                 # Gemini 摘要、OpenAI TTS
├── collectors/         # 資料爬取（YouTube、新聞、Mops）
└── firebase/           # Firebase Admin 初始化與集合定義

types/                  # TypeScript 型別定義
middleware.ts           # Clerk 身份驗證 Middleware
```

---

## 本機開發

**1. 安裝依賴**

```bash
pnpm install
```

**2. 設定環境變數**

複製 `.env.example` 並填入各服務金鑰：

```bash
cp .env.example .env.local
```

**3. 啟動開發伺服器**

```bash
pnpm dev
```

開啟 http://localhost:3000

---

## 環境變數

| 變數 | 說明 |
|------|------|
| `FIREBASE_PROJECT_ID` | Firebase 專案 ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase Service Account Email |
| `FIREBASE_PRIVATE_KEY` | Firebase Service Account 私鑰 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk 公開金鑰 |
| `CLERK_SECRET_KEY` | Clerk 私密金鑰 |
| `GEMINI_API_KEY` | Google Gemini API 金鑰 |
| `OPENAI_API_KEY` | OpenAI API 金鑰（TTS 語音） |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 存取 Token |
| `CRON_SECRET` | Cron Job 驗證密碼（自訂隨機字串） |
| `ADMIN_EMAIL` | 管理員 Email |
