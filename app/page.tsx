import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import type { KolPostDoc } from "@/lib/firebase/collections";
import { GooayeVideoCard, type VideoSummary } from "@/components/home/GooayeVideoCard";
import { MarketDashboard } from "@/components/market/MarketDashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const snapshot = await adminDb
    .collection("kolPosts")
    .where("platform", "==", "youtube")
    .orderBy("publishedAt", "desc")
    .limit(3)
    .get();

  const videos: VideoSummary[] = snapshot.docs.map((doc) => {
    const p = doc.data() as KolPostDoc;
    return {
      videoId: p.guid,
      title: p.title ?? "",
      publishedAt: p.publishedAt.toDate().toISOString(),
      summary: p.translatedContent,
      tags: p.tags,
      sourceUrl: p.sourceUrl ?? `https://www.youtube.com/watch?v=${p.guid}`,
    };
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">

      {/* 市場行情 */}
      <section className="mb-10">
        <MarketDashboard />
      </section>

      {/* Gooaye YouTube 最新重點 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <h2 className="text-base font-semibold">KOL 影片筆記</h2>
          </div>
          <Link
            href="/kol"
            className="inline-flex items-center gap-1.5 text-primary text-xs font-medium hover:text-primary/80 transition-colors duration-200"
          >
            查看更多
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
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


      </section>
    </div>
  );
}
