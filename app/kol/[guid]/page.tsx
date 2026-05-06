import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import type { KolPostDoc } from "@/lib/firebase/collections";
import { notFound } from "next/navigation";
import { SectionCardList } from "@/components/kol/SectionCardList";
import { YoutubeEmbed } from "@/components/kol/YoutubeEmbed";
import { ReadingProgressBar } from "@/components/kol/ReadingProgressBar";

interface Props {
  params: Promise<{ guid: string }>;
}

export default async function VideoDetailPage({ params }: Props) {
  const { guid } = await params;

  const snapshot = await adminDb
    .collection("kolPosts")
    .where("guid", "==", guid)
    .where("platform", "==", "youtube")
    .limit(1)
    .get();

  if (snapshot.empty) notFound();

  const doc = snapshot.docs[0];
  const post = doc.data() as KolPostDoc;
  const publishedAt = post.publishedAt;

  const allPostsSnap = await adminDb
    .collection("kolPosts")
    .where("personId", "==", post.personId)
    .orderBy("publishedAt", "asc")
    .get();

  const allPosts = allPostsSnap.docs.map((d) => d.data() as KolPostDoc);
  const idx = allPosts.findIndex((p) => p.guid === post.guid);
  const prevPost =
    idx > 0
      ? { guid: allPosts[idx - 1].guid, title: allPosts[idx - 1].title }
      : null;
  const nextPost =
    idx < allPosts.length - 1
      ? { guid: allPosts[idx + 1].guid, title: allPosts[idx + 1].title }
      : null;

  const youtubeUrl =
    post.sourceUrl ?? `https://www.youtube.com/watch?v=${post.guid}`;
  const publishedDate = publishedAt.toDate().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Taipei",
  });
  const cards = post.sectionCards ?? [];
  const hasCards = cards.length > 0;

  return (
    <>
    <ReadingProgressBar />
    <div className={`${hasCards ? "max-w-5xl" : "max-w-2xl"} mx-auto py-5 sm:py-8 px-4`}>
      <Link
        href="/kol"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-5 group min-h-[44px]"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        KOL 影片筆記
      </Link>

      <div className={hasCards ? "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8 items-start" : ""}>
        {/* 主欄：影片 + 內容 */}
        <div>
          <div className="relative w-full aspect-video rounded-lg sm:rounded-xl overflow-hidden mb-2">
            <YoutubeEmbed guid={post.guid} title={post.title ?? ""} />
          </div>

          <div className="mb-4 sm:mb-5 pb-4 sm:pb-5 border-b">
            <h1 className="text-lg sm:text-xl font-bold leading-snug mb-1">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                股癌 Gooaye
              </span>
              <span className="opacity-40">·</span>
              <span>{publishedDate}</span>
              <span className="opacity-40">·</span>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-primary hover:underline py-2"
              >
                在 YouTube 觀看
                <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 text-[13px] sm:text-[14px] font-medium px-2.5 sm:px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border/60"
                >
                  <span className="opacity-50">#</span>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.translatedContent ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
                <h2 className="text-base font-semibold">文字精華重點</h2>
              </div>
              <div className="rounded-lg bg-muted/40 border border-border/50 p-3 sm:p-4">
                <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {post.translatedContent}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">尚未上傳文字重點，請前往管理頁面新增。</p>
          )}

          {post.audioUrl && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
                <h2 className="text-base font-semibold">語音摘要</h2>
              </div>
              <div className="rounded-lg bg-muted/40 border border-border/50 p-3 sm:p-4">
                <audio
                  controls
                  src={post.audioUrl}
                  className="w-full h-10"
                  preload="none"
                >
                  您的瀏覽器不支援音訊播放。
                </audio>
              </div>
            </div>
          )}

          {/* 上一篇 / 下一篇 */}
          {(prevPost || nextPost) && (
            <nav className="mt-8 pt-6 border-t grid grid-cols-2 gap-3">
              <div>
                {prevPost && (
                  <Link
                    href={`/kol/${prevPost.guid}`}
                    className="group flex flex-col gap-1 p-3 rounded-lg border hover:bg-muted/50 transition-colors h-full"
                  >
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                      </svg>
                      上一篇
                    </span>
                    <span className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{prevPost.title}</span>
                  </Link>
                )}
              </div>
              <div>
                {nextPost && (
                  <Link
                    href={`/kol/${nextPost.guid}`}
                    className="group flex flex-col gap-1 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-right h-full"
                  >
                    <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      下一篇
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{nextPost.title}</span>
                  </Link>
                )}
              </div>
            </nav>
          )}

          {/* 手機版：卡片顯示在內容下方 */}
          {hasCards && (
            <div className="mt-8 pt-6 border-t lg:hidden">
              <SectionCardList cards={cards} />
            </div>
          )}
        </div>

        {/* 右側欄：板塊分析卡片（桌機） */}
        {hasCards && (
          <div className="hidden lg:block sticky top-20 will-change-transform">
            <SectionCardList cards={cards} />
          </div>
        )}
      </div>
    </div>
    </>
  );
}
