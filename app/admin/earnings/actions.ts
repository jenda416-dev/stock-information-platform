"use server";

import { db } from "@/lib/db";
import { watchedStocks, earningsCalls } from "@/lib/db/schema";
import { eq, lt, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { fetchEarningsCallSchedule } from "@/lib/collectors/mops";
import { currentUser } from "@clerk/nextjs/server";

async function requireAdmin() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (email !== process.env.ADMIN_EMAIL) throw new Error("Unauthorized");
}

function getTodayStr() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Taipei" });
}

export async function addWatchedStock(stockCode: string, stockName: string) {
  await requireAdmin();
  if (!stockCode.trim() || !stockName.trim()) return { error: "股票代號和名稱為必填" };

  try {
    await db.insert(watchedStocks).values({
      stockCode: stockCode.trim(),
      stockName: stockName.trim(),
    }).onConflictDoNothing();
    revalidatePath("/admin/earnings");
    return { ok: true };
  } catch {
    return { error: "新增失敗" };
  }
}

export async function deleteWatchedStock(id: string) {
  await requireAdmin();
  await db.delete(watchedStocks).where(eq(watchedStocks.id, id));
  revalidatePath("/admin/earnings");
  return { ok: true };
}

export async function fetchEarningsFromMops() {
  await requireAdmin();

  const stocks = await db
    .select({ stockCode: watchedStocks.stockCode, stockName: watchedStocks.stockName })
    .from(watchedStocks)
    .where(eq(watchedStocks.isActive, true));

  if (stocks.length === 0) return { ok: true, inserted: 0, message: "沒有追蹤中的股票" };

  const stockCodes = stocks.map((s) => s.stockCode);
  const events = await fetchEarningsCallSchedule(stockCodes);

  let inserted = 0;
  if (events.length > 0) {
    const result = await db
      .insert(earningsCalls)
      .values(
        events.map((e) => ({
          stockCode: e.stockCode,
          stockName: e.stockName,
          callDate: e.callDate,
          callTime: e.callTime,
          location: e.location,
          officialUrl: e.officialUrl,
          pdfUrl: e.pdfUrl,
          status: "upcoming" as const,
        }))
      )
      .onConflictDoNothing()
      .returning({ id: earningsCalls.id });
    inserted = result.length;
  }

  // Mark past upcoming calls as completed
  const today = getTodayStr();
  await db
    .update(earningsCalls)
    .set({ status: "completed", updatedAt: new Date() })
    .where(and(lt(earningsCalls.callDate, today), eq(earningsCalls.status, "upcoming")));

  revalidatePath("/admin/earnings");
  revalidatePath("/earnings");
  return { ok: true, inserted };
}

export async function saveEarningsSummary(id: string, summary: string) {
  await requireAdmin();
  if (!id) return { error: "缺少法說會 ID" };

  const result = await db
    .update(earningsCalls)
    .set({
      summary: summary.trim() || null,
      status: "completed",
      updatedAt: new Date(),
    })
    .where(eq(earningsCalls.id, id))
    .returning({ id: earningsCalls.id });

  if (result.length === 0) return { error: "找不到該法說會記錄" };

  revalidatePath("/admin/earnings");
  revalidatePath("/earnings");
  return { ok: true };
}

export async function addEarningsCallManually(
  stockCode: string,
  stockName: string,
  callDate: string,
  callTime: string,
  location: string,
  officialUrl: string
) {
  await requireAdmin();
  if (!stockCode.trim() || !stockName.trim() || !callDate) {
    return { error: "股票代號、名稱和日期為必填" };
  }

  try {
    await db
      .insert(earningsCalls)
      .values({
        stockCode: stockCode.trim(),
        stockName: stockName.trim(),
        callDate,
        callTime: callTime.trim() || null,
        location: location.trim() || null,
        officialUrl: officialUrl.trim() || null,
        status: "upcoming",
      })
      .onConflictDoNothing();
    revalidatePath("/admin/earnings");
    revalidatePath("/earnings");
    return { ok: true };
  } catch {
    return { error: "新增失敗" };
  }
}
