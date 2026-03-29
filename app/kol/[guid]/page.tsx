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
      publishedAt: kolPosts.publishedAt,
    })
    .from(kolPosts)
    .innerJoin(kolPersons, eq(kolPosts.personId, kolPersons.id))
    .where(and(eq(kolPosts.guid, guid), eq(kolPersons.platform, "youtube")))
    .limit(1);

  if (!post) notFound();

  const youtubeUrl = post.sourceUrl ?? `https://www.youtube.com/watch?v=${post.guid}`;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Embedded video */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6">
        <iframe
          src={`https://www.youtube.com/embed/${post.guid}`}
          title={post.title ?? ""}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Title */}
      <div className="mb-6 pb-4 border-b">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">影片標題</p>
        <h1 className="text-xl font-bold leading-snug">{post.title}</h1>
      </div>

      {/* Summary */}
      {post.translatedContent ? (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h2 className="text-base font-semibold mb-3">文字精華重點</h2>
          <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {post.translatedContent}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">尚未上傳文字重點，請前往管理頁面新增。</p>
      )}
    </div>
  );
}
