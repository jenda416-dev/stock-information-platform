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
