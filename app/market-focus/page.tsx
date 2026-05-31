import type { Metadata } from "next";
import { MarketFocusView } from "@/components/sectors/MarketFocusView";

export const metadata: Metadata = {
  title: "產業板塊 | 股市資訊平台",
  description: "查看市場漲跌幅最大的概念股和族群有哪些",
};

export default function MarketFocusPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
          <h1 className="text-lg sm:text-xl font-bold leading-snug">產業板塊</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          台股產業板塊的上中下游結構、受惠個股與投資邏輯
        </p>
      </div>
      <MarketFocusView />
    </div>
  );
}
