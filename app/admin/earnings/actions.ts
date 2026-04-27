"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { EarningsCallDoc, WatchedStockDoc } from "@/lib/firebase/collections";
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
  if (!stockCode.trim() || !stockName.trim())
    return { error: "股票代號和名稱為必填" };

  try {
    const docRef = adminDb
      .collection("watchedStocks")
      .doc(stockCode.trim());
    const existing = await docRef.get();
    if (!existing.exists) {
      await docRef.set({
        stockCode: stockCode.trim(),
        stockName: stockName.trim(),
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    revalidatePath("/admin/earnings");
    return { ok: true };
  } catch {
    return { error: "新增失敗" };
  }
}

export async function deleteWatchedStock(id: string) {
  await requireAdmin();
  await adminDb.collection("watchedStocks").doc(id).delete();
  revalidatePath("/admin/earnings");
  return { ok: true };
}

export async function fetchEarningsFromMops() {
  await requireAdmin();

  const snapshot = await adminDb
    .collection("watchedStocks")
    .where("isActive", "==", true)
    .get();

  const stocks = snapshot.docs.map((doc) => {
    const data = doc.data() as WatchedStockDoc;
    return { stockCode: data.stockCode, stockName: data.stockName };
  });

  if (stocks.length === 0)
    return { ok: true, inserted: 0, message: "沒有追蹤中的股票" };

  const stockCodes = stocks.map((s) => s.stockCode);
  const events = await fetchEarningsCallSchedule(stockCodes);

  let inserted = 0;
  if (events.length > 0) {
    const batch = adminDb.batch();
    const existenceChecks = await Promise.all(
      events.map((e) =>
        adminDb
          .collection("earningsCalls")
          .doc(`${e.stockCode}_${e.callDate}`)
          .get()
      )
    );

    events.forEach((e, i) => {
      if (!existenceChecks[i].exists) {
        const docRef = adminDb
          .collection("earningsCalls")
          .doc(`${e.stockCode}_${e.callDate}`);
        batch.set(docRef, {
          stockCode: e.stockCode,
          stockName: e.stockName,
          callDate: e.callDate,
          callTime: e.callTime ?? null,
          location: e.location ?? null,
          officialUrl: e.officialUrl ?? null,
          pdfUrl: e.pdfUrl ?? null,
          status: "upcoming",
          summary: null,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        inserted++;
      }
    });
    await batch.commit();
  }

  // Mark past upcoming calls as completed
  const today = getTodayStr();
  const pastUpcoming = await adminDb
    .collection("earningsCalls")
    .where("status", "==", "upcoming")
    .where("callDate", "<", today)
    .get();

  if (!pastUpcoming.empty) {
    const updateBatch = adminDb.batch();
    pastUpcoming.docs.forEach((doc) =>
      updateBatch.update(doc.ref, {
        status: "completed",
        updatedAt: FieldValue.serverTimestamp(),
      })
    );
    await updateBatch.commit();
  }

  revalidatePath("/admin/earnings");
  revalidatePath("/earnings");
  return { ok: true, inserted };
}

export async function saveEarningsSummary(id: string, summary: string) {
  await requireAdmin();
  if (!id) return { error: "缺少法說會 ID" };

  const docRef = adminDb.collection("earningsCalls").doc(id);
  const existing = await docRef.get();
  if (!existing.exists) return { error: "找不到該法說會記錄" };

  await docRef.update({
    summary: summary.trim() || null,
    status: "completed",
    updatedAt: FieldValue.serverTimestamp(),
  });

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
    const docId = `${stockCode.trim()}_${callDate}`;
    const docRef = adminDb.collection("earningsCalls").doc(docId);
    const existing = await docRef.get();
    if (!existing.exists) {
      await docRef.set({
        stockCode: stockCode.trim(),
        stockName: stockName.trim(),
        callDate,
        callTime: callTime.trim() || null,
        location: location.trim() || null,
        officialUrl: officialUrl.trim() || null,
        pdfUrl: null,
        status: "upcoming",
        summary: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    revalidatePath("/admin/earnings");
    revalidatePath("/earnings");
    return { ok: true };
  } catch {
    return { error: "新增失敗" };
  }
}
