import { db } from "@/lib/db";
import { kolPosts, kolPersons } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { AdminPostList } from "@/components/admin/AdminPostList";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
  }));

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">管理筆記</h1>
        <p className="text-muted-foreground text-sm">點擊影片列即可編輯筆記內容</p>
      </div>

      {adminPosts.length === 0 ? (
        <p className="text-muted-foreground text-sm">目前 DB 沒有 YouTube 影片，請先執行 cron 抓取資料。</p>
      ) : (
        <AdminPostList posts={adminPosts} />
      )}
    </div>
  );
}
