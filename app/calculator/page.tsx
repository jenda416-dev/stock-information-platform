import type { Metadata } from "next";
import { CalculatorTabs } from "./_components/CalculatorTabs";

export const metadata: Metadata = {
  title: "存股計算機 — 股市資訊平台",
  description: "定期定額試算、股息試算，幫你規劃 ETF 長期投資目標。",
};

export default function CalculatorPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="px-5 py-5">
          <h1 className="text-lg sm:text-xl font-bold leading-snug mb-1">存股計算機</h1>
          <p className="text-sm text-muted-foreground">
            定期定額幾年後能有多少？投入多少才能月領股息？
          </p>
        </div>
      </div>
      <CalculatorTabs />
    </div>
  );
}
