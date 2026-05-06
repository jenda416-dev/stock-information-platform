"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { KolPostDoc } from "@/lib/firebase/collections";
import { revalidatePath } from "next/cache";
import type { SectionCard } from "@/types/kol";
import { generateSectionCards } from "@/lib/ai/summarizeVideo";
import { generateAudioFromText } from "@/lib/ai/generateAudio";
import { uploadAudioToStorage } from "@/lib/firebase/storage";

export async function saveSummary(
  guid: string,
  title: string,
  summary: string,
  tags: string[],
  sectionCards: SectionCard[]
) {
  if (!guid) return { error: "缺少影片 ID" };

  const trimmedSummary = summary.trim() || null;
  const trimmedTitle = title.trim();
  const trimmedTags = tags.map((t) => t.trim()).filter(Boolean);
  const validCards = sectionCards.filter((c) => c.title.trim());

  const snapshot = await adminDb
    .collection("kolPosts")
    .where("guid", "==", guid)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return { error: `找不到影片 ID: ${guid}` };
  }

  const doc = snapshot.docs[0];
  const update: Partial<KolPostDoc> = {
    translatedContent: trimmedSummary,
    tags: trimmedTags.length > 0 ? trimmedTags : null,
    sectionCards: validCards.length > 0 ? validCards : null,
  };
  if (trimmedTitle) update.title = trimmedTitle;

  await doc.ref.update(update);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/kol/${guid}`);

  return { ok: true };
}

export async function generateCardsAction(guid: string, summary: string, title: string) {
  if (!guid || !summary.trim()) return { error: "缺少內容" };

  const cards = await generateSectionCards(summary, title);
  if (!cards.length) return { error: "AI 未能生成卡片，請確認摘要內容是否包含投資觀點" };

  const snapshot = await adminDb.collection("kolPosts").where("guid", "==", guid).limit(1).get();
  if (snapshot.empty) return { error: `找不到影片 ID: ${guid}` };

  await snapshot.docs[0].ref.update({ sectionCards: cards });
  revalidatePath(`/kol/${guid}`);

  return { ok: true, cards };
}

export async function generateAudioAction(guid: string, summary: string) {
  if (!guid || !summary.trim()) return { error: "缺少內容" };

  const buffer = await generateAudioFromText(summary);
  if (!buffer) return { error: "TTS 生成失敗，請檢查 OPENAI_API_KEY" };

  const audioUrl = await uploadAudioToStorage(buffer, guid);

  const snapshot = await adminDb.collection("kolPosts").where("guid", "==", guid).limit(1).get();
  if (snapshot.empty) return { error: `找不到影片 ID: ${guid}` };

  await snapshot.docs[0].ref.update({ audioUrl });
  revalidatePath(`/kol/${guid}`);

  return { ok: true, audioUrl };
}
