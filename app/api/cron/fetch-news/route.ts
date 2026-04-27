import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { NewsDigestDoc } from "@/lib/firebase/collections";
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
  const digestRef = adminDb.collection("newsDigests").doc(today);
  const existing = await digestRef.get();

  if (existing.exists) {
    const data = existing.data() as NewsDigestDoc;
    if (data.status === "complete") {
      return NextResponse.json({
        ok: true,
        message: "Already complete for today",
      });
    }
  } else {
    await digestRef.set({
      digestDate: today,
      bulletPoints: [],
      modelUsed: "gemini-2.0-flash-lite",
      articleCount: 0,
      status: "pending",
      generatedAt: null,
    });
  }

  try {
    const articles = await fetchAllNews();

    let bullets;
    try {
      bullets = await summarizeNews(articles);
    } catch {
      await new Promise((r) => setTimeout(r, 5000));
      bullets = await summarizeNews(articles);
    }

    await digestRef.update({
      bulletPoints: bullets,
      articleCount: articles.length,
      status: "complete",
      generatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      ok: true,
      articles: articles.length,
      bullets: bullets.length,
    });
  } catch (err) {
    await digestRef.update({ status: "failed" });
    console.error("Digest failed:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
