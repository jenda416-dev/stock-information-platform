import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import type { NewsDigestDoc } from "@/lib/firebase/collections";

function getTaiwanDateStr() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Taipei" });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const date = searchParams.get("date") ?? getTaiwanDateStr();

  const digestDoc = await adminDb.collection("newsDigests").doc(date).get();
  const digest = digestDoc.exists
    ? { id: digestDoc.id, ...(digestDoc.data() as NewsDigestDoc) }
    : null;

  const historySnapshot = await adminDb
    .collection("newsDigests")
    .where("status", "==", "complete")
    .orderBy("digestDate", "desc")
    .limit(7)
    .get();

  const history = historySnapshot.docs.map((doc) => ({
    digestDate: (doc.data() as NewsDigestDoc).digestDate,
  }));

  return NextResponse.json({ digest, history });
}
