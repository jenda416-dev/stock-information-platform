import { Card, CardContent } from "@/components/ui/card";
import type { IndexData } from "@/types/market";

function Sparkline({ data, positive, id }: { data: number[]; positive: boolean; id: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 100, H = 28, pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const line = `M ${pts.join(" L ")}`;
  const fill = `${line} L ${(W - pad).toFixed(2)},${H} L ${pad},${H} Z`;
  const color = positive ? "#ef4444" : "#10b981";
  const gradId = `sp-${id}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-7 mt-2" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradId})`} />
      <path d={line} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Props {
  index: IndexData;
}

function getColors(change: number) {
  if (change === 0) return {
    text: "text-muted-foreground",
    bg: "",
    border: "border-l-border",
    badge: "bg-muted text-muted-foreground",
  };
  if (change > 0) return {
    text: "text-red-500 dark:text-red-400",
    bg: "bg-red-50/40 dark:bg-red-950/10",
    border: "border-l-red-500 dark:border-l-red-400",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50/40 dark:bg-emerald-950/10",
    border: "border-l-emerald-500 dark:border-l-emerald-400",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };
}

export function IndexCard({ index }: Props) {
  const { text: colorClass, bg: bgClass, border: borderClass } = getColors(index.change);
  const sign = index.change >= 0 ? "+" : "";
  const arrow = index.change > 0 ? "▲" : index.change < 0 ? "▼" : "—";

  const weekSign = (index.weekChangePercent ?? 0) >= 0 ? "+" : "";
  const weekColorClass = (index.weekChangePercent ?? 0) > 0
    ? "text-red-500 dark:text-red-400"
    : (index.weekChangePercent ?? 0) < 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-muted-foreground";

  const priceFormatted = index.price.toLocaleString("zh-TW", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className={`border-l-4 ${borderClass} ${bgClass} overflow-hidden transition-all duration-200 hover:shadow-md`}>
      <CardContent className="py-3 px-4">
        {index.error ? (
          <p className="text-sm text-muted-foreground">資料暫時無法取得</p>
        ) : (
          <>
            {/* 名稱 + 本週漲跌幅 */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                {index.name}
              </span>
              {index.weekChangePercent !== undefined && (
                <span className={`text-[11px] font-semibold tabular-nums ${weekColorClass}`}>
                  週 {weekSign}{index.weekChangePercent.toFixed(2)}%
                </span>
              )}
            </div>

            {/* 價格 + 日漲跌 */}
            <p className="text-xl font-bold tracking-tight tabular-nums leading-none">{priceFormatted}</p>
            {index.change === 0 && index.changePercent === 0 ? (
              <p className="text-xs font-medium mt-1 text-muted-foreground">— 暫無漲跌資料</p>
            ) : (
              <p className={`text-xs font-semibold mt-1 tabular-nums ${colorClass}`}>
                {arrow} {sign}{index.change.toFixed(2)}&ensp;({sign}{index.changePercent.toFixed(2)}%)
              </p>
            )}
            {index.sparkline && index.sparkline.length >= 2 && (
              <Sparkline
                data={index.sparkline}
                positive={index.change >= 0}
                id={index.symbol.replace(/[^a-zA-Z0-9]/g, "")}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
