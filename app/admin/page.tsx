import { adminDb } from "@/lib/firebase/admin";
import type { KolPostDoc, WatchedStockDoc, EarningsCallDoc } from "@/lib/firebase/collections";
import { AdminPostList } from "@/components/admin/AdminPostList";
import { EarningsAdmin } from "@/components/admin/EarningsAdmin";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (email !== process.env.ADMIN_EMAIL) redirect("/");

  const postsSnapshot = await adminDb
    .collection("kolPosts")
    .where("platform", "==", "youtube")
    .orderBy("publishedAt", "desc")
    .limit(5)
    .get();

  const adminPosts = postsSnapshot.docs.map((doc) => {
    const p = doc.data() as KolPostDoc;
    return {
      guid: p.guid,
      title: p.title,
      publishedAt: p.publishedAt.toDate().toISOString(),
      summary: p.translatedContent,
      tags: p.tags,
      sectionCards: p.sectionCards,
    };
  });

  const stocksSnapshot = await adminDb
    .collection("watchedStocks")
    .orderBy("stockCode")
    .get();

  const stocks = stocksSnapshot.docs.map((doc) => {
    const s = doc.data() as WatchedStockDoc;
    return { id: doc.id, stockCode: s.stockCode, stockName: s.stockName };
  });

  const callsSnapshot = await adminDb
    .collection("earningsCalls")
    .orderBy("callDate", "desc")
    .limit(50)
    .get();

  const calls = callsSnapshot.docs.map((doc) => {
    const c = doc.data() as EarningsCallDoc;
    return {
      id: doc.id,
      stockCode: c.stockCode,
      stockName: c.stockName,
      callDate: c.callDate,
      callTime: c.callTime,
      location: c.location,
      officialUrl: c.officialUrl,
      pdfUrl: c.pdfUrl,
      status: c.status,
      summary: c.summary,
    };
  });

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">管理</h1>
      </div>

      <Tabs defaultValue="notes">
        <TabsList className="mb-6">
          <TabsTrigger value="notes">管理筆記</TabsTrigger>
          <TabsTrigger value="earnings">法說會</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <p className="text-muted-foreground text-sm mb-4">點擊影片列即可編輯筆記內容</p>
          {adminPosts.length === 0 ? (
            <p className="text-muted-foreground text-sm">目前 DB 沒有 YouTube 影片，請先執行 cron 抓取資料。</p>
          ) : (
            <AdminPostList posts={adminPosts} />
          )}
        </TabsContent>

        <TabsContent value="earnings">
          <EarningsAdmin stocks={stocks} calls={calls} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
