import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IndexData } from "@/types/market";

interface Props {
  index: IndexData;
}

function getColors(change: number): { text: string; bg: string } {
  if (change === 0) return { text: "text-muted-foreground", bg: "" };
  if (change > 0) {
    return {
      text: "text-red-500 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/20",
    };
  }
  return {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/20",
  };
}

export function IndexCard({ index }: Props) {
  const { text: colorClass, bg: bgClass } = getColors(index.change);
  const sign = index.change >= 0 ? "+" : "";
  const arrow = index.change > 0 ? "▲" : index.change < 0 ? "▼" : "—";

  const priceFormatted = index.price.toLocaleString("zh-TW", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className={bgClass}>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {index.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {index.error ? (
          <p className="text-sm text-muted-foreground">資料暫時無法取得</p>
        ) : (
          <>
            <p className="text-2xl font-bold tracking-tight">{priceFormatted}</p>
            {index.change === 0 && index.changePercent === 0 ? (
              <p className="text-sm font-medium mt-1 text-muted-foreground">— 暫無漲跌資料</p>
            ) : (
              <p className={`text-sm font-medium mt-1 ${colorClass}`}>
                {arrow} {sign}{index.change.toFixed(2)}&ensp;({sign}{index.changePercent.toFixed(2)}%)
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
