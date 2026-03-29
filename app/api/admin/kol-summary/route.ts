import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { kolPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
    return NextResponse.json({ error: "guid and summary are required" }, { status: 400 });
  }

  const result = await db
    .update(kolPosts)
    .set({ translatedContent: summary })
    .where(eq(kolPosts.guid, guid))
    .returning({ id: kolPosts.id });

  if (result.length === 0) {
    return NextResponse.json({ error: `No post found with guid: ${guid}` }, { status: 404 });
  }

  return NextResponse.json({ ok: true, updated: result[0].id });
}
