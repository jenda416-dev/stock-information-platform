"use client";
import { useRef, useEffect, useState } from "react";

type StockTag = { code: string; name: string; market: string };


export function SectorTagList({ stocks }: { stocks: StockTag[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutoff, setCutoff] = useState<number | null>(null);
  const measured = useRef(false);

  useEffect(() => {
    if (measured.current) return;
    const el = containerRef.current;
    if (!el) return;

    const tags = Array.from(el.querySelectorAll<HTMLElement>("[data-tag]"));
    if (tags.length === 0) return;

    // Collect distinct row tops (tolerance ±2px for sub-pixel rendering)
    const rowTops: number[] = [];
    for (const tag of tags) {
      const top = tag.offsetTop;
      if (!rowTops.some((r) => Math.abs(r - top) < 2)) rowTops.push(top);
    }
    rowTops.sort((a, b) => a - b);

    measured.current = true;

    if (rowTops.length <= 2) return; // fits in 2 rows, no cutoff needed

    // Find the last tag index that's in row 1 or 2
    const row3Top = rowTops[2];
    let lastIn2Rows = -1;
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].offsetTop < row3Top - 1) lastIn2Rows = i;
    }

    // Use lastIn2Rows slot for the "+N" badge — show one fewer tag
    if (lastIn2Rows > 0) setCutoff(lastIn2Rows);
  }, []);

  const visibleStocks = cutoff !== null ? stocks.slice(0, cutoff) : stocks;
  const hiddenCount = cutoff !== null ? stocks.length - cutoff : 0;

  return (
    <div ref={containerRef} className="flex flex-wrap gap-1.5">
      {visibleStocks.map((stock) => (
        <span
          key={stock.code}
          data-tag
          className="inline-flex items-center gap-0.5 text-[12px] font-medium px-2 py-0.5 rounded bg-primary/10 text-primary"
        >
          {stock.name}
          <span className="opacity-40">{stock.code}</span>
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="inline-flex items-center text-[12px] font-medium px-2 py-0.5 rounded bg-muted/70 text-muted-foreground">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}
