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
    .where(eq(kolPersons.isActive, true));

  let totalInserted = 0;

  for (const person of persons) {
    try {
      if (person.platform !== "youtube") continue;

      const channelId = new URL(person.feedUrl).searchParams.get("channel_id") ?? "";
      const posts = await fetchYoutubePosts(channelId);

      for (const post of posts) {
        try {
          let translatedContent: string | null = null;
          let tags: string[] | null = null;
          if (post.fullTranscript) {
            const result = await summarizeVideoTranscript(post.fullTranscript, post.title);
            translatedContent = result?.summary ?? null;
            tags = result?.tags ?? null;
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
              tags,
              publishedAt: post.publishedAt,
            })
            .onConflictDoNothing();
          totalInserted++;
        } catch {
          // skip individual post errors
        }
      }
    } catch (err) {
      console.error(`Failed to fetch posts for ${person.slug}:`, err);
    }
  }

  return NextResponse.json({ ok: true, inserted: totalInserted });
}
