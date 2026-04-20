"use server";

import { db } from "@/lib/db";
import { kolPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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

  const result = await db
    .update(kolPosts)
    .set({
      ...(trimmedTitle && { title: trimmedTitle }),
      translatedContent: trimmedSummary,
      tags: trimmedTags.length > 0 ? trimmedTags : null,
      sectionCards: validCards.length > 0 ? validCards : null,
    })
    .where(eq(kolPosts.guid, guid))
    .returning({ id: kolPosts.id });

  if (result.length === 0) {
    return { error: `找不到影片 ID: ${guid}` };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/kol/${guid}`);

  return { ok: true };
}
