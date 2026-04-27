import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import type { KolPostDoc } from "@/lib/firebase/collections";

function verifySecret(req: NextRequest) {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { guid, summary } = body as { guid?: string; summary?: string };

  if (!guid || !summary) {
    return NextResponse.json(
      { error: "guid and summary are required" },
      { status: 400 }
    );
  }

  const snapshot = await adminDb
    .collection("kolPosts")
    .where("guid", "==", guid)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return NextResponse.json(
      { error: `No post found with guid: ${guid}` },
      { status: 404 }
    );
  }

  const doc = snapshot.docs[0];
  await doc.ref.update({ translatedContent: summary });

  return NextResponse.json({ ok: true, updated: doc.id });
}
