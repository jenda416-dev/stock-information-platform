import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { zhTW } from "date-fns/locale";
import type { KolPost } from "@/types/kol";

const PREVIEW_LENGTH = 150;

interface Props {
  post: KolPost;
}

export function KolPostCard({ post }: Props) {
  const relativeTime = formatDistanceToNow(new Date(post.publishedAt), {
    addSuffix: true,
    locale: zhTW,
  });

  const contentWithoutYaml = post.translatedContent?.replace(/^---\n[\s\S]*?\n---\n*/, "") || "";
  const titleMatch = contentWithoutYaml.match(/^\s*#+\s+(.+?)(?:\n|$)/);
  const previewTitle = titleMatch ? titleMatch[1].replace(/[*_~`]/g, "").trim() : null;

  let bodyContent = contentWithoutYaml;
  if (titleMatch) {
    bodyContent = bodyContent.slice(titleMatch.index! + titleMatch[0].length);
  }

  const cleanBody = bodyContent
    .replace(/^\s*#+\s+前言\s*/i, "") // remove "### 前言"
    .replace(/📌\s*影片主旨\s*/g, "") // remove "📌 影片主旨"
    .replace(/#+\s+/g, "") // remove other headings
    .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // replace links with just text
    .replace(/[*_~`]/g, "") // remove bold/italic/code
    .replace(/\n+/g, " ") // convert newlines to spaces
    .trim();

  const previewText = cleanBody ? cleanBody.slice(0, 300) : null;

  return (
    <Link href={`/kol/${post.guid}`} className="block group cursor-pointer">
      <Card className="gap-2 overflow-hidden transition duration-200 group-hover:shadow-md border-t-0">
        <CardHeader className="pb-0 pt-0">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={`https://i.ytimg.com/vi/${post.guid}/mqdefault.jpg`}
                alt={post.title ?? ""}
                className="w-28 h-[63px] rounded-lg object-cover"
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 dark:ring-white/10" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">{post.title}</p>
                <span className="flex-shrink-0 text-xs font-medium text-primary-foreground bg-primary rounded-md px-2.5 py-1 whitespace-nowrap group-hover:bg-primary/90 transition-colors">
                  查看筆記
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                <svg className="w-3 h-3 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>股癌 Gooaye</span>
                <span className="opacity-40">·</span>
                <span className="tabular-nums">{relativeTime}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        {(previewTitle || previewText || (post.tags && post.tags.length > 0)) && (
          <CardContent className="pt-0 space-y-3">
            {(previewTitle || previewText) && (
              <div className="space-y-1.5">
                {previewTitle && (
                  <h3 className="font-bold text-[15px] leading-snug text-foreground/90">{previewTitle}</h3>
                )}
                {previewText && (
                  <p className="text-sm leading-relaxed text-foreground/75 line-clamp-2">{previewText}</p>
                )}
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <>
                {(previewTitle || previewText) && <div className="border-t border-border/40" />}
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 text-[12px] font-medium px-2 py-0.5 rounded bg-muted/70 text-muted-foreground"
                    >
                      <span className="opacity-40">#</span>
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
