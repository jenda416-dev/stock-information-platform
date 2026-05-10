# Auto Audio Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 每當 `fetch-gooaye` cron 抓到新影片並生成文字摘要後，自動用 OpenAI TTS 將摘要轉成 MP3，上傳 Firebase Storage，並在 KOL 詳情頁顯示音訊播放器。

**Architecture:** cron 生成摘要後立即呼叫 OpenAI TTS → 取得 MP3 buffer → 上傳 Firebase Storage 取得公開 URL → 存入 Firestore `kolPosts.audioUrl`。前端讀取 `audioUrl` 渲染 HTML5 `<audio>` 播放器。

**Tech Stack:** openai (npm), firebase-admin/storage, Next.js Server Component, HTML5 audio

---

## File Map

| 檔案 | 異動 |
|------|------|
| `lib/ai/generateAudio.ts` | **NEW** — OpenAI TTS wrapper，輸入文字回傳 Buffer |
| `lib/firebase/storage.ts` | **NEW** — 上傳 Buffer 到 Firebase Storage，回傳公開 URL |
| `lib/firebase/admin.ts` | **MODIFY** — export `adminStorage` (Storage bucket) |
| `lib/firebase/collections.ts` | **MODIFY** — KolPostDoc 加 `audioUrl: string \| null` |
| `types/kol.ts` | **MODIFY** — KolPost 加 `audioUrl: string \| null` |
| `app/api/cron/fetch-gooaye/route.ts` | **MODIFY** — cron 裡呼叫 generateAudio + uploadAudio |
| `app/kol/[guid]/page.tsx` | **MODIFY** — 在文字精華重點下方加音訊播放器 |
| `.env.example` | **MODIFY** — 加 `OPENAI_API_KEY`, `FIREBASE_STORAGE_BUCKET` |

---

## Task 1: 安裝 openai 套件 + 更新 .env.example

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `.env.example`

- [ ] **Step 1: 安裝 openai npm 套件**

```bash
cd "/Users/alexchen/Desktop/Coding Chicken/stock-dashboard"
npm install openai
```

Expected: `package.json` dependencies 出現 `"openai": "^4.x.x"`

- [ ] **Step 2: 更新 .env.example**

在 `.env.example` 最後加入：

```
# OpenAI TTS
OPENAI_API_KEY=

# Firebase Storage bucket（格式：{project-id}.appspot.com）
FIREBASE_STORAGE_BUCKET=
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: install openai sdk, add audio env vars to example"
```

---

## Task 2: 初始化 Firebase Storage + 建立上傳 utility

**Files:**
- Modify: `lib/firebase/admin.ts`
- Create: `lib/firebase/storage.ts`

- [ ] **Step 1: 在 admin.ts export adminStorage bucket**

將 `lib/firebase/admin.ts` 改為：

```typescript
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const adminDb = getFirestore();
export const adminStorage = getStorage().bucket();
```

- [ ] **Step 2: 建立 lib/firebase/storage.ts**

```typescript
import { adminStorage } from "./admin";

export async function uploadAudioToStorage(
  buffer: Buffer,
  guid: string
): Promise<string> {
  const file = adminStorage.file(`kol-audio/${guid}.mp3`);

  await file.save(buffer, {
    metadata: { contentType: "audio/mpeg" },
  });

  await file.makePublic();

  return file.publicUrl();
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/firebase/admin.ts lib/firebase/storage.ts
git commit -m "feat: initialize Firebase Storage, add uploadAudioToStorage utility"
```

---

## Task 3: OpenAI TTS wrapper

**Files:**
- Create: `lib/ai/generateAudio.ts`

- [ ] **Step 1: 建立 lib/ai/generateAudio.ts**

```typescript
import OpenAI from "openai";

export async function generateAudioFromText(
  text: string
): Promise<Buffer | null> {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text.slice(0, 4096),
      response_format: "mp3",
    });

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}
```

> 注意：OpenAI TTS 單次最多 4096 字元。`translatedContent` 為 3-5 句，遠低於上限，直接 slice 保險。

- [ ] **Step 2: Commit**

```bash
git add lib/ai/generateAudio.ts
git commit -m "feat: add OpenAI TTS wrapper generateAudioFromText"
```

---

## Task 4: 更新 types / schema

**Files:**
- Modify: `lib/firebase/collections.ts`
- Modify: `types/kol.ts`

- [ ] **Step 1: 在 KolPostDoc 加 audioUrl**

`lib/firebase/collections.ts` 的 `KolPostDoc` interface，在 `sectionCards` 那行下方加：

```typescript
  audioUrl: string | null;
```

完整 interface 變成：

```typescript
export interface KolPostDoc {
  personId: string;
  guid: string;
  title: string | null;
  content: string | null;
  sourceUrl: string | null;
  platform: string;
  translatedContent: string | null;
  tags: string[] | null;
  sectionCards: SectionCard[] | null;
  audioUrl?: string | null;
  publishedAt: Timestamp;
  fetchedAt: Timestamp;
  personSlug: string;
  personName: string;
  personAvatar: string | null;
}
```

- [ ] **Step 2: 在 KolPost 加 audioUrl**

`types/kol.ts` 的 `KolPost` interface 加：

```typescript
export interface KolPost {
  id: string;
  guid: string;
  title: string | null;
  content: string | null;
  translatedContent: string | null;
  tags: string[] | null;
  audioUrl?: string | null;
  sourceUrl: string | null;
  platform: string;
  publishedAt: string;
  personSlug: string;
  personName: string;
  personAvatar: string | null;
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/firebase/collections.ts types/kol.ts
git commit -m "feat: add audioUrl field to KolPostDoc and KolPost types"
```

---

## Task 5: 更新 fetch-gooaye cron

**Files:**
- Modify: `app/api/cron/fetch-gooaye/route.ts`

- [ ] **Step 1: 更新 import**

在檔案頂部現有 import 後加：

```typescript
import { generateAudioFromText } from "@/lib/ai/generateAudio";
import { uploadAudioToStorage } from "@/lib/firebase/storage";
```

- [ ] **Step 2: 在 AI 生成區塊加音訊邏輯**

找到 `if (post.fullTranscript) {` 區塊，改成：

```typescript
      let translatedContent: string | null = null;
      let tags: string[] | null = null;
      let sectionCards: SectionCard[] | null = null;
      let audioUrl: string | null = null;

      if (post.fullTranscript) {
        const [summaryResult, cards] = await Promise.all([
          summarizeVideoTranscript(post.fullTranscript, post.title),
          generateSectionCards(post.fullTranscript, post.title),
        ]);
        translatedContent = summaryResult?.summary ?? null;
        tags = summaryResult?.tags ?? null;
        sectionCards = cards.length ? cards : null;

        if (translatedContent) {
          const audioBuffer = await generateAudioFromText(translatedContent);
          if (audioBuffer) {
            audioUrl = await uploadAudioToStorage(audioBuffer, post.guid).catch(() => null);
          }
        }
      }
```

- [ ] **Step 3: 將 audioUrl 寫入 postData**

在 `postData` 物件加 `audioUrl`：

```typescript
        const postData: Omit<KolPostDoc, "fetchedAt"> & {
          fetchedAt: ReturnType<typeof FieldValue.serverTimestamp>;
        } = {
          personId: person.slug,
          guid: post.guid,
          title: post.title,
          content: post.content,
          sourceUrl: post.sourceUrl,
          platform: post.platform,
          translatedContent,
          tags,
          sectionCards,
          audioUrl,
          publishedAt: Timestamp.fromDate(post.publishedAt),
          fetchedAt: FieldValue.serverTimestamp(),
          personSlug: person.slug,
          personName: person.displayName,
          personAvatar: person.avatarUrl,
        };
```

- [ ] **Step 4: TypeScript 檢查**

```bash
"/Users/alexchen/Desktop/Coding Chicken/stock-dashboard/node_modules/.bin/tsc" --noEmit --project "/Users/alexchen/Desktop/Coding Chicken/stock-dashboard/tsconfig.json"
```

Expected: 無輸出（零錯誤）

- [ ] **Step 5: Commit**

```bash
git add app/api/cron/fetch-gooaye/route.ts
git commit -m "feat: auto-generate TTS audio in fetch-gooaye cron and store to Firebase Storage"
```

---

## Task 6: 前端音訊播放器

**Files:**
- Modify: `app/kol/[guid]/page.tsx`

- [ ] **Step 1: 在「文字精華重點」區塊下方加音訊播放器**

在 `app/kol/[guid]/page.tsx` 找到 `{post.translatedContent ? (` 區塊，在整個 `translatedContent` div 後面（closing `</div>` 之後、上一篇/下一篇 nav 之前）加入：

```tsx
          {post.audioUrl && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
                <h2 className="text-base font-semibold">語音摘要</h2>
              </div>
              <div className="rounded-lg bg-muted/40 border border-border/50 p-3 sm:p-4">
                <audio
                  controls
                  src={post.audioUrl}
                  className="w-full h-10"
                  preload="none"
                >
                  您的瀏覽器不支援音訊播放。
                </audio>
              </div>
            </div>
          )}
```

> 注意：`post` 此時是 `KolPostDoc`（Server Component 直接讀 Firestore），`audioUrl` 欄位已在 Task 4 加入 `KolPostDoc`，直接可用。

- [ ] **Step 2: TypeScript 檢查**

```bash
"/Users/alexchen/Desktop/Coding Chicken/stock-dashboard/node_modules/.bin/tsc" --noEmit --project "/Users/alexchen/Desktop/Coding Chicken/stock-dashboard/tsconfig.json"
```

Expected: 無輸出

- [ ] **Step 3: Commit**

```bash
git add app/kol/[guid]/page.tsx
git commit -m "feat: add audio player to KOL detail page when audioUrl exists"
```

---

## Verification（端對端測試）

1. **確認 env vars 已設定** — `.env.local` 裡有 `OPENAI_API_KEY` 和 `FIREBASE_STORAGE_BUCKET`

2. **手動觸發 cron**：
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/fetch-gooaye
   ```
   Expected response: `{"ok":true,"inserted":N}`（N ≥ 1，或 0 若影片已存在）

3. **若 inserted=0（影片已存在）** — 在 Firebase Console → Firestore → `kolPosts` 找一筆現有文件，手動加欄位 `audioUrl: ""` 再刪掉，或用腳本重跑單筆。

4. **Firebase Console 確認** — `kolPosts` collection 的新文件 `audioUrl` 欄位有 `https://storage.googleapis.com/...` 格式的 URL

5. **Storage 確認** — Firebase Console → Storage → `kol-audio/` 目錄有 `{guid}.mp3`

6. **前端確認** — 瀏覽 `http://localhost:3000/kol/{guid}`，「文字精華重點」下方出現音訊播放器，點擊可播放中文語音

---

## 補充：現有影片補生音訊（backfill）

現有影片的 `audioUrl` 為 null，可建立一次性腳本 `scripts/backfill-audio.ts`：

```typescript
// 只需 fetch all kolPosts where audioUrl == null && translatedContent != null
// 逐筆呼叫 generateAudioFromText + uploadAudioToStorage，寫回 audioUrl
// 建議加 rate limit（每筆間 1 秒）避免 OpenAI rate limit
```

此腳本非必要，視需求決定是否實作。
