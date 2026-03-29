import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { zhTW } from "date-fns/locale";

export interface VideoSummary {
  videoId: string;
  title: string;
  publishedAt: string;
  summary: string | null;
  sourceUrl: string;
}

const PREVIEW_LENGTH = 150;

export function GooayeVideoCard({ video }: { video: VideoSummary }) {
  const displayText = video.summary
    ? video.summary.length > PREVIEW_LENGTH
      ? video.summary.slice(0, PREVIEW_LENGTH) + "…"
      : video.summary
    : null;

  const relativeTime = formatDistanceToNow(new Date(video.publishedAt), {
    addSuffix: true,
    locale: zhTW,
  });

  return (
    <Link href={`/kol/${video.videoId}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <img
              src={`https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`}
              alt={video.title}
              className="w-24 h-[54px] rounded object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm leading-snug line-clamp-2">{video.title}</p>
                <span className="flex-shrink-0 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md px-2.5 py-1 whitespace-nowrap">
                  查看筆記
                </span>
              </div>
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
        {displayText && (
          <CardContent className="pt-0">
            <p className="text-sm leading-relaxed text-foreground/80">{displayText}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
