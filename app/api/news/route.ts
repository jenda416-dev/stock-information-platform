import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsDigests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

function getTaiwanDateStr() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Taipei" });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const date = searchParams.get("date") ?? getTaiwanDateStr();

  const [digest] = await db
    .select()
    .from(newsDigests)
    .where(eq(newsDigests.digestDate, date));

  // Also return list of available digest dates (last 7)
  const history = await db
    .select({ digestDate: newsDigests.digestDate })
    .from(newsDigests)
    .where(eq(newsDigests.status, "complete"))
    .orderBy(desc(newsDigests.digestDate))
    .limit(7);

  return NextResponse.json({ digest: digest ?? null, history });
}
