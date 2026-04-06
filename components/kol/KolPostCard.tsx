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

  const displayText = post.translatedContent
    ? post.translatedContent.length > PREVIEW_LENGTH
      ? post.translatedContent.slice(0, PREVIEW_LENGTH) + "…"
      : post.translatedContent
    : null;

  return (
    <Link href={`/kol/${post.guid}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <img
              src={`https://i.ytimg.com/vi/${post.guid}/mqdefault.jpg`}
              alt={post.title ?? ""}
              className="w-24 h-[54px] rounded object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-snug line-clamp-2">{post.title}</p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>股癌 Gooaye</span>
                <span className="opacity-50">·</span>
                <span>{relativeTime}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        {(displayText || (post.tags && post.tags.length > 0)) && (
          <CardContent className="pt-0 space-y-2">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                    style={{ border: "1px solid #bfdbfe" }}
                  >
                    <span className="opacity-60">#</span>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {displayText && (
              <p className="text-sm leading-relaxed text-foreground/80">{displayText}</p>
            )}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
