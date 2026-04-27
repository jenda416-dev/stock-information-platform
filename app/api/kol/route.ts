import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import type { KolPostDoc } from "@/lib/firebase/collections";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor"); // ISO timestamp of last post
  const limit = 20;
  const slug = searchParams.get("slug");

  let query = adminDb
    .collection("kolPosts")
    .orderBy("publishedAt", "desc")
    .limit(limit) as FirebaseFirestore.Query;

  if (slug) {
    query = query.where("personSlug", "==", slug);
  }

  if (cursor) {
    query = query.startAfter(Timestamp.fromDate(new Date(cursor)));
  }

  const snapshot = await query.get();
  const posts = snapshot.docs.map((doc) => {
    const data = doc.data() as KolPostDoc;
    return {
      id: doc.id,
      guid: data.guid,
      title: data.title,
      content: data.content,
      translatedContent: data.translatedContent,
      sourceUrl: data.sourceUrl,
      platform: data.platform,
      publishedAt: data.publishedAt.toDate().toISOString(),
      personSlug: data.personSlug,
      personName: data.personName,
      personAvatar: data.personAvatar,
    };
  });

  const nextCursor =
    posts.length === limit ? posts[posts.length - 1].publishedAt : null;
  return NextResponse.json({ posts, cursor: nextCursor });
}
