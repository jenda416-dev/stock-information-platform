import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { SectionCard } from "../types/kol";

// 從筆記最後的 #hashtag 行解析 tags
function parseTagsFromNotes(notes: string): string[] {
  const tagSection = notes.match(/#{1,3}[^\n]*[Tt]ags?\s*\n+([\s\S]*?)(?=\n#{1,3} |$)/);
  const source = tagSection ? tagSection[1] : notes.slice(-300);
  const matches = source.match(/#([^\s#，,、！!。.]+)/g) ?? [];
  return [...new Set(matches.map((t) => t.replace(/^#/, "")))].slice(0, 8);
}

// 從 Obsidian 筆記的「潛在標的盤點」段落解析出 SectionCard，不需要 AI
function parseCardsFromNotes(notes: string): SectionCard[] {
  // 找「潛在標的盤點」段落（任意 heading 層級）
  const sectionMatch = notes.match(/#{1,3}[^\n]*潛在標的盤點([\s\S]*?)(?=\n#{1,3} |$)/);
  if (!sectionMatch) return [];

  const section = sectionMatch[1];
  // 找所有 - **...** 開頭的 bullet
  const bulletLines = section.match(/- \*\*[\s\S]+?(?=\n- \*\*|\n#{1,3} |$)/g) ?? [];

  const cards: SectionCard[] = [];

  for (const bullet of bulletLines) {
    const titleMatch = bullet.match(/\*\*(.+?)\*\*/);
    if (!titleMatch) continue;

    const rawTitle = titleMatch[1].trim();
    const descMatch = bullet.match(/：\*?\*?\s+([\s\S]+)/);
    const desc = descMatch
      ? descMatch[1].replace(/\s*_\(.*?\)_/g, "").replace(/\n\s*/g, " ").trim()
      : "";

    // Only look for stocks inside （...） brackets; fall back to full title if none
    const searchArea = rawTitle.match(/[（(]([^）)]+)[）)]/)?.[1] ?? rawTitle;
    // Extract "中文名 代號" pairs (e.g., "國巨 2327"), then any remaining tickers
    const namedPairs = [...searchArea.matchAll(/([一-鿿]{1,8})\s+(\d{4}(?:-KY)?)/g)];
    const pairedCodes = new Set(namedPairs.map((m) => m[2]));
    const namedStocks = namedPairs.map((m) => `${m[1]} ${m[2]}`);
    const allRaw = searchArea.match(/\b([A-Z]{2,5}|\d{4}(?:-KY)?)\b/g) ?? [];
    const stocks = [...new Set([...namedStocks, ...allRaw.filter((s) => !pairedCodes.has(s))])];

    const cleanTitle = rawTitle.replace(/\s*[（(][^）)]*[）)]/g, "").replace(/[：:]\s*$/, "").trim().slice(0, 20);

    cards.push({
      title: cleanTitle,
      stocks,
      logic: desc.split("。")[0] + (desc.includes("。") ? "。" : ""),
      adviceKeyword: "觀察",
      advice: desc.split("。").slice(1, 3).join("。").trim() || desc.slice(0, 80),
    });
  }

  return cards.slice(0, 7);
}

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
const VAULT_DIR = "/Users/alexchen/Desktop/Coding Chicken/Obsidian/股癌文字摘要/raw/股癌文字摘要";

async function syncGooaye() {
  const files = readdirSync(VAULT_DIR).filter((f) => f.startsWith("EP") && f.endsWith(".md"));

  if (files.length === 0) {
    console.log("Obsidian Vault 裡找不到 EP*.md 檔案");
    return;
  }

  console.log(`找到 ${files.length} 個筆記\n`);

  for (const file of files) {
    const label = file.replace(".md", "");
    const raw = readFileSync(join(VAULT_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    const videoId = data.videoId as string | undefined;
    if (!videoId) {
      console.warn(`[skip] ${label}：frontmatter 缺少 videoId`);
      continue;
    }

    console.log(`[${label}] videoId: ${videoId}`);

    const snap = await db.collection("kolPosts").where("guid", "==", videoId).limit(1).get();
    if (snap.empty) {
      console.warn(`[${label}] Firestore 找不到 guid=${videoId} 的 kolPost`);
      continue;
    }

    const docRef = snap.docs[0].ref;
    const title = (snap.docs[0].data().title as string | null) ?? label;

    console.log(`  → 找到文件：${title}`);
    console.log(`  → 生成 sectionCards...`);

    const cards = parseCardsFromNotes(content);
    const tags = parseTagsFromNotes(content);
    console.log(`  → ${cards.length} 張卡片，${tags.length} 個 tags`);

    await docRef.update({
      title: label,
      translatedContent: content.trim(),
      sectionCards: cards.length ? cards : null,
      tags: tags.length ? tags : null,
    });

    console.log(`  ✓ 已更新\n`);
  }

  console.log("Done");
}

syncGooaye().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
