import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsDigests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { fetchAllNews } from "@/lib/collectors/news";
import { summarizeNews } from "@/lib/ai/summarize";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyCronSecret(req: NextRequest) {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

function getTaiwanDateStr() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Taipei" });
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getTaiwanDateStr();

  const [existing] = await db
    .select()
    .from(newsDigests)
    .where(eq(newsDigests.digestDate, today));

  if (existing?.status === "complete") {
    return NextResponse.json({ ok: true, message: "Already complete for today" });
  }

  // Create pending row
  await db
    .insert(newsDigests)
    .values({
      digestDate: today,
      bulletPoints: [],
      modelUsed: "gemini-2.0-flash",
      articleCount: 0,
      status: "pending",
    })
    .onConflictDoNothing();

  try {
    const articles = await fetchAllNews();

    let bullets;
    try {
      bullets = await summarizeNews(articles);
    } catch {
      // one retry
      await new Promise((r) => setTimeout(r, 5000));
      bullets = await summarizeNews(articles);
    }

    await db
      .update(newsDigests)
      .set({
        bulletPoints: bullets,
        articleCount: articles.length,
        status: "complete",
        generatedAt: new Date(),
      })
      .where(eq(newsDigests.digestDate, today));

    return NextResponse.json({ ok: true, articles: articles.length, bullets: bullets.length });
  } catch (err) {
    await db
      .update(newsDigests)
      .set({ status: "failed" })
      .where(eq(newsDigests.digestDate, today));

    console.error("Digest failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
