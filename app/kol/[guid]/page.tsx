import Link from "next/link";
import { db } from "@/lib/db";
import { kolPosts, kolPersons } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ guid: string }>;
}

export default async function VideoDetailPage({ params }: Props) {
  const { guid } = await params;

  const [post] = await db
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
    .where(and(eq(kolPosts.guid, guid), eq(kolPersons.platform, "youtube")))
    .limit(1);

  if (!post) notFound();

  const youtubeUrl = post.sourceUrl ?? `https://www.youtube.com/watch?v=${post.guid}`;
  const publishedDate = post.publishedAt.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Taipei",
  });

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">

      {/* Back navigation */}
      <Link
        href="/kol"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        KOL 影片筆記
      </Link>

      {/* Embedded video */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-5">
        <iframe
          src={`https://www.youtube.com/embed/${post.guid}`}
          title={post.title ?? ""}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Title + metadata */}
      <div className="mb-5 pb-5 border-b">
        <h1 className="text-xl font-bold leading-snug mb-3">{post.title}</h1>
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
            className="inline-flex items-center gap-0.5 text-primary hover:underline"
          >
            在 YouTube 觀看
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide"
            >
              <span className="opacity-50">#</span>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {post.translatedContent ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold">文字精華重點</h2>
          </div>
          <div className="rounded-lg bg-muted/40 border border-border/50 p-4">
            <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {post.translatedContent}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">尚未上傳文字重點，請前往管理頁面新增。</p>
      )}
    </div>
  );
}
