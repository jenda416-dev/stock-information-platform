import { Card, CardContent } from "@/components/ui/card";
import type { FearGreedData } from "@/types/market";

interface Props {
  data: FearGreedData;
}

const RATING_MAP: Record<string, { label: string; text: string }> = {
  "extreme fear": { label: "極度恐懼", text: "text-green-600 dark:text-green-400" },
  "fear":         { label: "恐懼",     text: "text-green-500 dark:text-green-400" },
  "neutral":      { label: "中性",     text: "text-yellow-500 dark:text-yellow-400" },
  "greed":        { label: "貪婪",     text: "text-red-500 dark:text-red-400" },
  "extreme greed":{ label: "極度貪婪", text: "text-red-600 dark:text-red-400" },
};

export function FearGreedCard({ data }: Props) {
  if (data.error) {
    return (
      <Card className="border-l-4 border-l-yellow-500/60 overflow-hidden">
        <CardContent className="py-3 px-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">CNN 恐懼貪婪指數</span>
          <p className="text-sm text-muted-foreground mt-1">資料暫時無法取得</p>
        </CardContent>
      </Card>
    );
  }

  const rating = RATING_MAP[data.rating] ?? RATING_MAP["neutral"];
  const diff = data.score - data.previousClose;
  const sign = diff >= 0 ? "+" : "";
  const clampedScore = Math.min(100, Math.max(0, data.score));

  return (
    <Card className="border-l-4 border-l-yellow-500/60 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

      <CardContent className="py-3 px-4">
        {/* 標題 + 昨收變化 */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            CNN 恐懼貪婪指數
          </span>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            昨收 {data.previousClose.toFixed(0)}&ensp;
            <span className={diff >= 0 ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>
              {sign}{diff.toFixed(1)}
            </span>
          </span>
        </div>

        {/* 分數（主角）+ 評級 */}
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-bold tabular-nums leading-none ${rating.text}`}>
            {data.score}
          </span>
          <span className={`text-sm font-semibold ${rating.text}`}>
            {rating.label}
          </span>
        </div>

        {/* Gauge bar */}
        <div className="relative h-1.5 rounded-full overflow-visible mt-2"
          style={{ background: "linear-gradient(to right, #22c55e 0%, #84cc16 25%, #eab308 50%, #f97316 75%, #ef4444 100%)" }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-background border-2 border-foreground/50 shadow-md"
            style={{ left: `${clampedScore}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
