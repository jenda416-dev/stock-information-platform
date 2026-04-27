"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { KolPostDoc } from "@/lib/firebase/collections";
import { revalidatePath } from "next/cache";
import type { SectionCard } from "@/types/kol";

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
