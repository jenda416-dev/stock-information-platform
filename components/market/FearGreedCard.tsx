import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            CNN 恐懼貪婪指數
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">資料暫時無法取得</p>
        </CardContent>
      </Card>
    );
  }

  const rating = RATING_MAP[data.rating] ?? RATING_MAP["neutral"];
  const diff = data.score - data.previousClose;
  const sign = diff >= 0 ? "+" : "";
  const clampedScore = Math.min(100, Math.max(0, data.score));

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          CNN 恐懼貪婪指數
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 5段顏色進度條 + 指針 */}
        <div className="relative h-2 rounded-full overflow-visible mb-3"
          style={{
            background: "linear-gradient(to right, #22c55e 0%, #84cc16 25%, #eab308 50%, #f97316 75%, #ef4444 100%)",
          }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-700 dark:border-gray-200 shadow"
            style={{ left: `${clampedScore}%` }}
          />
        </div>

        {/* 分數 */}
        <p className="text-2xl font-bold tracking-tight">{data.score}</p>

        {/* 評級 + 前一收盤同列 */}
        <div className="flex items-baseline justify-between mt-0.5">
          <p className={`text-sm font-semibold ${rating.text}`}>
            {rating.label}
          </p>
          <p className="text-xs text-muted-foreground">
            前一收盤：{data.previousClose.toFixed(1)}&ensp;
            <span className={diff >= 0 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
              {sign}{diff.toFixed(1)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
