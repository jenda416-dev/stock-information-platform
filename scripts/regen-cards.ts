import { config } from "dotenv";
config({ path: ".env.local" });

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { generateSectionCards } from "../lib/ai/summarizeVideo";

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
const GUID = process.argv[2];

if (!GUID) {
  console.error("用法：npx tsx scripts/regen-cards.ts <guid>");
  process.exit(1);
}

async function main() {
  console.log(`🔍 查找 ${GUID}...`);
  const snap = await db.collection("kolPosts").where("guid", "==", GUID).limit(1).get();
  if (snap.empty) {
    console.error("找不到此 guid");
    process.exit(1);
  }

  const doc = snap.docs[0];
  const data = doc.data();
  const summary = data.translatedContent as string | null;
  const title = data.title as string | null;

  if (!summary) {
    console.error("此文章沒有 translatedContent，無法生成卡片");
    process.exit(1);
  }

  console.log(`📝 標題：${title}`);
  console.log("🃏 重新生成板塊分析卡片...");

  const cards = await generateSectionCards(summary, title ?? "");
  console.log(`  → 生成 ${cards.length} 張卡片`);
  cards.forEach((c, i) =>
    console.log(`    [${i + 1}] ${c.title} (${c.adviceKeyword}) stocks: [${c.stocks.join(", ")}]`)
  );

  await doc.ref.update({ sectionCards: cards.length ? cards : null });
  console.log("✅ 完成！");
}

main().catch(console.error);
