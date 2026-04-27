import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { KolPersonDoc, KolPostDoc } from "@/lib/firebase/collections";
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

  const snapshot = await adminDb
    .collection("kolPersons")
    .where("isActive", "==", true)
    .get();

  const persons = snapshot.docs.map((doc) => ({
    ...(doc.data() as KolPersonDoc),
  }));

  let totalInserted = 0;

  for (const person of persons) {
    try {
      if (person.platform !== "youtube") continue;

      const channelId =
        new URL(person.feedUrl).searchParams.get("channel_id") ?? "";
      const posts = await fetchYoutubePosts(channelId);

      for (const post of posts) {
        try {
          let translatedContent: string | null = null;
          let tags: string[] | null = null;
          if (post.fullTranscript) {
            const result = await summarizeVideoTranscript(
              post.fullTranscript,
              post.title
            );
            translatedContent = result?.summary ?? null;
            tags = result?.tags ?? null;
          }

          const docId = `${person.slug}_${post.guid}`;
          const docRef = adminDb.collection("kolPosts").doc(docId);
          const existing = await docRef.get();
          if (!existing.exists) {
            const postData: Omit<KolPostDoc, "fetchedAt"> & {
              fetchedAt: ReturnType<typeof FieldValue.serverTimestamp>;
            } = {
              personId: person.slug,
              guid: post.guid,
              title: post.title,
              content: post.content,
              sourceUrl: post.sourceUrl,
              platform: post.platform,
              translatedContent,
              tags,
              sectionCards: null,
              publishedAt: Timestamp.fromDate(post.publishedAt),
              fetchedAt: FieldValue.serverTimestamp(),
              personSlug: person.slug,
              personName: person.displayName,
              personAvatar: person.avatarUrl,
            };
            await docRef.set(postData);
            totalInserted++;
          }
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
