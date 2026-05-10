import { config } from "dotenv";
config({ path: ".env.local" });

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
  const updates = [
    { guid: "osQQt5fYQ0c", title: "EP657 | 🐫" },
    { guid: "-SBOKVzL6S0", title: "EP656 | 🍇" }
  ];

  for (const item of updates) {
    console.log(`🔍 更新 ${item.guid} 的標題為: ${item.title}`);
    const snap = await db
      .collection("kolPosts")
      .where("guid", "==", item.guid)
      .limit(1)
      .get();
      
    if (!snap.empty) {
      await snap.docs[0].ref.update({ title: item.title });
      console.log(`✅ 成功更新 ${item.title}`);
    } else {
      console.log(`❌ 找不到 ${item.guid}`);
    }
  }
}

main().catch(console.error);
