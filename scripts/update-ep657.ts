import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { generateSectionCards, extractTagsFromSummary } from "../lib/ai/summarizeVideo";
import { generateAudioFromText } from "../lib/ai/generateAudio";
import { uploadAudioToStorage } from "../lib/firebase/storage";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

async function main() {
  const GUID = "-SBOKVzL6S0";
  
  const mdPath = path.join(__dirname, "../../Obsidian Vault/股癌文字摘要/EP656 | 🍇.md");
  const markdownContent = fs.readFileSync(mdPath, "utf-8").trim();

  // Extract title
  const titleMatch = markdownContent.match(/##\s+(.+)/);
  const TITLE = titleMatch ? titleMatch[1].trim() : "EP657";

  console.log(`🔍 找 EP657 (${GUID}) 文件...`);
  const snap = await db
    .collection("kolPosts")
    .where("guid", "==", GUID)
    .limit(1)
    .get();
    
  if (snap.empty) {
    console.error("找不到該影片文件");
    process.exit(1);
  }
  const docRef = snap.docs[0].ref;

  console.log("🏷️ 萃取 Tags...");
  const tags = await extractTagsFromSummary(markdownContent, TITLE);
  console.log("  → Tags:", tags);

  console.log("🃏 生成板塊分析卡片...");
  const cards = await generateSectionCards(markdownContent, TITLE);
  console.log(`  → 生成 ${cards.length} 張卡片`);
  cards.forEach((c, i) =>
    console.log(`    [${i + 1}] ${c.title} (${c.adviceKeyword})`)
  );

  console.log("🎵 生成 TTS 語音...");
  const audioTextMatch = markdownContent.match(/### 📌 影片主旨\n+([\s\S]+?)\n+###/);
  const audioText = audioTextMatch 
    ? audioTextMatch[1].trim() 
    : "本集影片重點已經整理完畢，請參考詳細文字摘要。";
    
  const audioBuffer = await generateAudioFromText(audioText);
  let audioUrl: string | null = null;
  if (audioBuffer) {
    audioUrl = await uploadAudioToStorage(audioBuffer, GUID);
    console.log("  → 上傳完成:", audioUrl);
  } else {
    console.log("  → TTS 失敗，跳過");
  }

  await docRef.update({
    title: TITLE,
    translatedContent: markdownContent,
    tags: tags.length ? tags : null,
    sectionCards: cards.length ? cards : null,
    audioUrl: audioUrl ?? null,
  });

  console.log("✅ EP657 更新完成！");
}

main().catch(console.error);
