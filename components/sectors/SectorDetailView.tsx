"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import { stripSectorSuffix } from "@/lib/utils";
import type {
  SectorResearchDoc,
  SectorResearchCategory,
  SectorResearchStock,
} from "@/lib/firebase/collections";

// ── Helper components ────────────────────────────────────────────────────────

const BENEFIT_CONFIG = {
  最高: {
    label: "受惠最高",
    className:
      "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 font-semibold",
  },
  高: {
    label: "受惠高",
    className: "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30",
  },
  中: {
    label: "受惠中",
    className:
      "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  },
  低: { label: "受惠低", className: "text-muted-foreground bg-muted" },
} as const;

type BenefitKey = keyof typeof BENEFIT_CONFIG;

function groupByTier(cats: SectorResearchCategory[]) {
  const result: { tier: string; items: SectorResearchCategory[] }[] = [];
  for (const cat of cats) {
    const group = result.find((g) => g.tier === cat.tier);
    if (group) group.items.push(cat);
    else result.push({ tier: cat.tier, items: [cat] });
  }
  return result;
}

function StockItem({ stock }: { stock: SectorResearchStock }) {
  const [open, setOpen] = useState(false);
  const benefit = BENEFIT_CONFIG[stock.benefit as BenefitKey];
  const hasPoints = stock.points.length > 0;
  const yahooUrl =
    stock.market === "台股" ? `https://tw.stock.yahoo.com/quote/${stock.code}.TW` :
    stock.market === "日股" ? `https://finance.yahoo.co.jp/quote/${stock.code}.T` :
    stock.market === "韓股" ? `https://finance.yahoo.com/quote/${stock.code}.KS` :
    `https://finance.yahoo.com/quote/${stock.code}`;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div
        className={`flex items-center justify-between px-4 py-3 ${hasPoints ? "cursor-pointer select-none" : ""}`}
        onClick={() => hasPoints && setOpen((v) => !v)}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[11px] text-muted-foreground">
              {yahooUrl ? (
                <a
                  href={yahooUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                  onClick={(e) => { e.stopPropagation(); sendGAEvent("event", "stock_link_click", { code: stock.code, market: stock.market }); }}
                >
                  {stock.market} {stock.code}
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <>{stock.market} {stock.code}</>
              )}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded ${benefit.className}`}>
              {benefit.label}
            </span>
          </div>
          <p className="text-sm font-semibold">{stock.name}</p>
        </div>
        {hasPoints && (
          <svg
            className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-border/50">
          <ol className="space-y-2.5">
            {stock.points.map((point, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-sm text-foreground/80 leading-relaxed"
              >
                <span className="shrink-0 w-4 text-right font-semibold text-primary/70">
                  {i + 1}.
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function SectorDetailView({ research }: { research: SectorResearchDoc }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [showFade, setShowFade] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => { handleScroll(); }, []);

  useEffect(() => {
    pillRefs.current[selectedIdx]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedIdx]);

  const visibleCategories = research.categories.filter(
    (cat) => cat.description.length > 0
  );
  const tieredGroups = groupByTier(visibleCategories);
  const currentCategory = visibleCategories[selectedIdx] ?? visibleCategories[0];

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 h-[calc(100vh-3.5rem)] flex flex-col">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3 shrink-0">
        <Link href="/market-focus" className="hover:text-foreground transition-colors">
          產業板塊
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{stripSectorSuffix(research.name)}</span>
      </nav>
      {/* Title — mobile: tappable to expand overview; desktop: plain h1 */}
      {research.overview ? (
        <>
          <button
            className="lg:hidden w-full flex items-center justify-between gap-2 mb-3 shrink-0 text-left"
            onClick={() => setOverviewOpen((v) => !v)}
          >
            <h1 className="text-xl font-bold">{stripSectorSuffix(research.name)}</h1>
            <svg
              className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${overviewOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {overviewOpen && (
            <div className="lg:hidden mb-3 shrink-0">
              <p className={`text-sm text-muted-foreground leading-relaxed ${overviewExpanded ? "" : "line-clamp-4"}`}>
                {research.overview}
              </p>
              {!overviewExpanded && research.overview.length > 120 && (
                <button
                  onClick={() => setOverviewExpanded(true)}
                  className="text-xs text-primary mt-1 hover:text-primary/80 transition-colors"
                >
                  展開全文
                </button>
              )}
            </div>
          )}
          <h1 className="hidden lg:block text-xl font-bold mb-4 shrink-0">{stripSectorSuffix(research.name)}</h1>
        </>
      ) : (
        <h1 className="text-xl font-bold mb-4 shrink-0">{stripSectorSuffix(research.name)}</h1>
      )}

      {/* Mobile: pill selector */}
      <div className="relative lg:hidden mb-4 shrink-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto -mx-4 px-4 border-b border-border"
        >
          {visibleCategories.map((cat, idx) => (
            <button
              key={cat.name}
              ref={(el) => { pillRefs.current[idx] = el; }}
              onClick={() => setSelectedIdx(idx)}
              className={`shrink-0 flex flex-col items-start px-3 pt-1.5 pb-2 border-b-2 -mb-px transition-colors ${
                selectedIdx === idx
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-[10px] leading-none mb-1 opacity-60 whitespace-nowrap">{cat.tier}</span>
              <span className="text-xs font-medium whitespace-nowrap">{cat.name}</span>
            </button>
          ))}
        </div>
        {showFade && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent" />
        )}
      </div>

      {/* Three-column layout: left & right fixed, middle scrolls */}
      <div className="flex gap-6 flex-1 overflow-hidden min-h-0">

        {/* Left: tier nav */}
        <aside className="hidden lg:block w-56 shrink-0 overflow-y-auto pb-8">
          <nav>
            {tieredGroups.map(({ tier, items }, groupIdx) => (
              <div key={tier} className={groupIdx > 0 ? "mt-6" : ""}>
                <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest px-3 mb-1.5">
                  {tier}
                </p>
                {items.map((cat) => {
                  const globalIdx = visibleCategories.indexOf(cat);
                  const isActive = selectedIdx === globalIdx;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedIdx(globalIdx)}
                      className={`w-full text-left py-2 border-l-2 transition-colors leading-snug mb-0.5 text-sm pl-4 ${
                        isActive
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-foreground/60 hover:text-foreground hover:border-border"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main: scrollable content */}
        <div className="flex-1 overflow-y-auto min-w-0 pb-8">
          {currentCategory.description && (
            <p className="text-sm text-foreground/80 leading-relaxed mb-5">
              {currentCategory.description}
            </p>
          )}
          <div className="space-y-2">
            {currentCategory.stocks.map((stock, i) => (
              <StockItem key={`${stock.code}-${i}`} stock={stock} />
            ))}
          </div>
        </div>

        {/* Right: overview */}
        <aside className="hidden lg:block w-60 shrink-0 overflow-y-auto pb-8">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold mb-2">
              {stripSectorSuffix(research.name)}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {research.overview}
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
