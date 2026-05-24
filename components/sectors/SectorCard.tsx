import Link from "next/link";
import type { SectorResearchDoc, SectorResearchStock } from "@/lib/firebase/collections";
import { SectorTagList } from "./SectorTagList";
import { stripSectorSuffix } from "@/lib/utils";

function getTopStocks(research: SectorResearchDoc): SectorResearchStock[] {
  const seen = new Set<string>();
  const all: SectorResearchStock[] = [];
  for (const cat of research.categories) {
    for (const stock of cat.stocks) {
      if (!seen.has(stock.code) && (stock.benefit === "最高" || stock.benefit === "高")) {
        seen.add(stock.code);
        all.push(stock);
      }
    }
  }
  return all.sort((a, b) => b.stars - a.stars);
}


export function SectorCard({ research, isLast, isOdd }: { research: SectorResearchDoc; isLast?: boolean; isOdd?: boolean }) {
  const topStocks = getTopStocks(research);

  return (
    <div
      className={`relative rounded-lg border border-border bg-card p-5 hover:shadow-md transition-all duration-200 flex flex-col gap-4 group${isLast && isOdd ? " sm:max-w-[calc(50%-10px)]" : ""}`}
    >
      {/* Stretched card link — sits behind tags */}
      <Link
        href={`/market-focus/${research.sectorId}`}
        className="absolute inset-0 z-[1] rounded-lg"
        aria-label={stripSectorSuffix(research.name)}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-bold leading-snug group-hover:text-primary transition-colors truncate">
          {stripSectorSuffix(research.name)}
        </h3>
        <svg className="w-4 h-4 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Overview — 2 lines */}
      {research.overview && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 -mt-2">
          {research.overview}
        </p>
      )}

      {/* Stock tags — z-[2] to sit above the stretched link */}
      <div className="relative z-[2]">
        <SectorTagList stocks={topStocks} />
      </div>
      {research.updated && (
        <p className="text-[11px] text-muted-foreground/50 text-right -mt-2">
          更新 {research.updated}
        </p>
      )}
    </div>
  );
}
