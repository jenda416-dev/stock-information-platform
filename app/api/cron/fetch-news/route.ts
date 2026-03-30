import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsArticles, newsDigests } from "@/lib/db/schema";
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
  return new Date()
    .toLocaleDateString("sv-SE", { timeZone: "Asia/Taipei" }); // returns YYYY-MM-DD
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getTaiwanDateStr();

  // Check if digest already complete for today
  const existing = await db
    .select()
    .from(newsDigests)
    .where(eq(newsDigests.digestDate, today));

  if (existing[0]?.status === "complete") {
    return NextResponse.json({ ok: true, message: "Already complete for today" });
  }

  // Step 1: Fetch articles
  const articles = await fetchAllNews(today);

  // Step 2: Insert articles into DB (ignore duplicates) - bulk insert
  if (articles.length > 0) {
    await db
      .insert(newsArticles)
      .values(
        articles.map((article) => ({
          sourceName: article.sourceName,
          title: article.title,
          description: article.description,
          url: article.url,
          publishedAt: article.publishedAt,
          fetchedDate: today,
        }))
      )
      .onConflictDoNothing();
  }

  // Step 3: Create pending digest row
  await db
    .insert(newsDigests)
    .values({
      digestDate: today,
      bulletPoints: [],
      modelUsed: "gemini-2.0-flash",
      articleCount: articles.length,
      status: "pending",
    })
    .onConflictDoNothing();

  // Step 4: Generate AI summary (with one retry on failure)
  async function generateWithRetry() {
    try {
      return await summarizeNews(articles, today);
    } catch (firstErr) {
      await new Promise((r) => setTimeout(r, 5000));
      return await summarizeNews(articles, today);
    }
  }

  try {
    const bullets = await generateWithRetry();

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

    console.error("Summarization failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
