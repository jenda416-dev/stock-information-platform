import Link from "next/link";
import { db } from "@/lib/db";
import { kolPosts, kolPersons } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { GooayeVideoCard, type VideoSummary } from "@/components/home/GooayeVideoCard";
import { MarketDashboard } from "@/components/market/MarketDashboard";

export default async function HomePage() {
  const posts = await db
    .select({
      guid: kolPosts.guid,
      title: kolPosts.title,
      sourceUrl: kolPosts.sourceUrl,
      translatedContent: kolPosts.translatedContent,
      tags: kolPosts.tags,
      publishedAt: kolPosts.publishedAt,
    })
    .from(kolPosts)
    .innerJoin(kolPersons, eq(kolPosts.personId, kolPersons.id))
    .where(eq(kolPersons.platform, "youtube"))
    .orderBy(desc(kolPosts.publishedAt))
    .limit(3);

  const videos: VideoSummary[] = posts.map((p) => ({
    videoId: p.guid,
    title: p.title ?? "",
    publishedAt: p.publishedAt.toISOString(),
    summary: p.translatedContent,
    tags: p.tags,
    sourceUrl: p.sourceUrl ?? `https://www.youtube.com/watch?v=${p.guid}`,
  }));

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">股市資訊平台</h1>
        <p className="text-muted-foreground text-sm">追蹤市場重要人士動態，掌握每日財經重點</p>
      </div>

      {/* 市場行情 */}
      <section className="mb-10">
        <MarketDashboard />
      </section>

      {/* Gooaye YouTube 最新重點 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <h2 className="text-lg font-semibold">KOL 影片筆記</h2>
        </div>

        {videos.length === 0 ? (
          <p className="text-muted-foreground text-sm">尚無資料，請先執行 cron 抓取影片。</p>
        ) : (
          <div className="flex flex-col gap-4">
            {videos.map((video) => (
              <GooayeVideoCard key={video.videoId} video={video} />
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/kol"
            className="inline-flex items-center gap-1.5 rounded-md border px-5 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            查看更多 →
          </Link>
        </div>
      </section>
    </div>
  );
}
