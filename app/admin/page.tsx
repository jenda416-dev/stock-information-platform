import { db } from "@/lib/db";
import { kolPosts, kolPersons, watchedStocks, earningsCalls } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { AdminPostList } from "@/components/admin/AdminPostList";
import { EarningsAdmin } from "@/components/admin/EarningsAdmin";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (email !== process.env.ADMIN_EMAIL) redirect("/");

  const posts = await db
    .select({
      guid: kolPosts.guid,
      title: kolPosts.title,
      publishedAt: kolPosts.publishedAt,
      summary: kolPosts.translatedContent,
      tags: kolPosts.tags,
      sectionCards: kolPosts.sectionCards,
    })
    .from(kolPosts)
    .innerJoin(kolPersons, eq(kolPosts.personId, kolPersons.id))
    .where(eq(kolPersons.platform, "youtube"))
    .orderBy(desc(kolPosts.publishedAt))
    .limit(5);

  const adminPosts = posts.map((p) => ({
    guid: p.guid,
    title: p.title,
    publishedAt: p.publishedAt.toISOString(),
    summary: p.summary,
    tags: p.tags,
    sectionCards: p.sectionCards,
  }));

  const stocks = await db
    .select({ id: watchedStocks.id, stockCode: watchedStocks.stockCode, stockName: watchedStocks.stockName })
    .from(watchedStocks)
    .orderBy(watchedStocks.stockCode);

  const calls = await db
    .select({
      id: earningsCalls.id,
      stockCode: earningsCalls.stockCode,
      stockName: earningsCalls.stockName,
      callDate: earningsCalls.callDate,
      callTime: earningsCalls.callTime,
      location: earningsCalls.location,
      officialUrl: earningsCalls.officialUrl,
      pdfUrl: earningsCalls.pdfUrl,
      status: earningsCalls.status,
      summary: earningsCalls.summary,
    })
    .from(earningsCalls)
    .orderBy(desc(earningsCalls.callDate))
    .limit(50);

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
