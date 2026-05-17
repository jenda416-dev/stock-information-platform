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
  const snap = await db.collection("kolPosts").get();

  let checkedDocs = 0;
  let fixedDocs = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const cards = data.sectionCards;
    if (!Array.isArray(cards) || cards.length === 0) continue;

    checkedDocs++;

    const fixed = cards.map((card: Record<string, unknown>) => {
      if (card.advice && card.advice === card.logic) {
        return { ...card, advice: "" };
      }
      return card;
    });

    const hasChange = fixed.some(
      (card: Record<string, unknown>, i: number) => card.advice !== cards[i].advice
    );

    if (hasChange) {
      await doc.ref.update({ sectionCards: fixed });
      console.log(`fixed: ${doc.id} (${data.title ?? "no title"})`);
      fixedDocs++;
    }
  }

  console.log(`\ndone — checked ${checkedDocs} docs, fixed ${fixedDocs}`);
}

main().catch(console.error);
