import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { kolPersons, kolPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { fetchYoutubePosts } from "@/lib/collectors/youtube";
import { summarizeVideoTranscript } from "@/lib/ai/summarizeVideo";

export const runtime = "nodejs";
export const maxDuration = 300;

function verifyCronSecret(req: NextRequest) {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const persons = await db
    .select()
    .from(kolPersons)
    .where(eq(kolPersons.slug, "youtube_gooaye"));

  if (persons.length === 0) {
    return NextResponse.json({ ok: false, error: "gooaye not found" });
  }

  const person = persons[0];
  const channelId = new URL(person.feedUrl).searchParams.get("channel_id") ?? "";
  const posts = await fetchYoutubePosts(channelId);

  let totalInserted = 0;
  for (const post of posts) {
    try {
      let translatedContent: string | null = null;
      if (post.fullTranscript) {
        translatedContent = await summarizeVideoTranscript(post.fullTranscript, post.title);
      }

      await db
        .insert(kolPosts)
        .values({
          personId: person.id,
          guid: post.guid,
          title: post.title,
          content: post.content,
          sourceUrl: post.sourceUrl,
          platform: post.platform,
          translatedContent,
          publishedAt: post.publishedAt,
        })
        .onConflictDoNothing();
      totalInserted++;
    } catch {
      // skip individual post errors
    }
  }

  return NextResponse.json({ ok: true, inserted: totalInserted });
}
