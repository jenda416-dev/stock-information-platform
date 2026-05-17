# 股市資訊平台

以 AI 自動整理財經 KOL 的影片內容，讓你用讀的掌握每集重點，不用花時間看完整支影片。

**線上版本：** https://stockinfo-notes.vercel.app  
**設計系統：** https://stockinfo-notes.vercel.app/design

---

## 功能

| 頁面 | 說明 |
|------|------|
| `/` | 首頁，台股 / 美股 / 加密貨幣行情 + 最新 KOL 筆記 |
| `/kol` | KOL 影片筆記列表，依時間倒序排列 |
| `/kol/[guid]` | 單篇完整筆記：提及標的（附 Yahoo Finance 連結）、時間戳重點、結論與行動指南、個股觀察卡、前後集導航 |

---

## 技術棧

| 項目 | 技術 |
|------|------|
| 前端框架 | Next.js（App Router） |
| UI | Tailwind CSS v4、shadcn/ui、@base-ui/react |
| 資料庫 | Firebase Firestore |
| 身份驗證 | Clerk |
| AI 摘要 | Google Gemini |
| 語音合成 | OpenAI TTS |
| 檔案儲存 | Vercel Blob |
| 部署 | Vercel |

---

## 本地開發

```bash
npm install
cp .env.example .env.local   # 填入各服務金鑰
npm run dev
```

---

## 環境變數

詳見 `.env.example`。

| 變數 | 說明 |
|------|------|
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk 身份驗證 |
| `GEMINI_API_KEY` | Google Gemini（AI 摘要） |
| `OPENAI_API_KEY` | OpenAI TTS（語音合成） |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob（音檔儲存） |
| `CRON_SECRET` | Cron job 驗證用隨機字串 |
| `ADMIN_EMAIL` | 管理員帳號 |

---

## Cron Jobs

| 路由 | 排程（UTC） | 說明 |
|------|------------|------|
| `/api/cron/fetch-gooaye` | 每週三、六 10:30 | 抓取股癌最新集數、生成 AI 筆記並寫入資料庫 |

所有 cron route 需帶 `Authorization: Bearer <CRON_SECRET>` header。
