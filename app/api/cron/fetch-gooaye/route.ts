import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { KolPersonDoc, KolPostDoc } from "@/lib/firebase/collections";
import type { SectionCard } from "@/types/kol";
import { fetchYoutubePosts } from "@/lib/collectors/youtube";
import { summarizeVideoTranscript, generateSectionCards } from "@/lib/ai/summarizeVideo";
import { generateAudioFromText } from "@/lib/ai/generateAudio";
import { uploadAudioToStorage } from "@/lib/firebase/storage";

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

  const personDoc = await adminDb
    .collection("kolPersons")
    .doc("youtube_gooaye")
    .get();

  if (!personDoc.exists) {
    return NextResponse.json({ ok: false, error: "gooaye not found" });
  }

  const person = personDoc.data() as KolPersonDoc;
  const channelId =
    new URL(person.feedUrl).searchParams.get("channel_id") ?? "";
  const posts = await fetchYoutubePosts(channelId);

  let totalInserted = 0;
  for (const post of posts) {
    try {
      let translatedContent: string | null = null;
      let tags: string[] | null = null;
      let sectionCards: SectionCard[] | null = null;
      let audioUrl: string | null = null;

      if (post.fullTranscript) {
        const [summaryResult, cards] = await Promise.all([
          summarizeVideoTranscript(post.fullTranscript, post.title),
          generateSectionCards(post.fullTranscript, post.title),
        ]);
        translatedContent = summaryResult?.summary ?? null;
        tags = summaryResult?.tags ?? null;
        sectionCards = cards.length ? cards : null;

        if (translatedContent) {
          const audioBuffer = await generateAudioFromText(translatedContent);
          if (audioBuffer) {
            audioUrl = await uploadAudioToStorage(audioBuffer, post.guid).catch(() => null);
          }
        }
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
          sectionCards,
          audioUrl,
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

  return NextResponse.json({ ok: true, inserted: totalInserted });
}
