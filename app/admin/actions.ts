"use server";

import { db } from "@/lib/db";
import { kolPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveSummary(guid: string, title: string, summary: string) {
  if (!guid) return { error: "缺少影片 ID" };

  const result = await db
    .update(kolPosts)
    .set({
      ...(title.trim() && { title: title.trim() }),
      translatedContent: summary.trim() || null,
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
