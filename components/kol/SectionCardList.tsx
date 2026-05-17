"use client";

import { useState } from "react";
import type { SectionCard } from "@/types/kol";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-white/60 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SectionCardItem({ card }: { card: SectionCard }) {
  const [open, setOpen] = useState(true);

  const isBullish = card.adviceKeyword === "買進" || card.adviceKeyword === "加碼";
  const isBearish = card.adviceKeyword === "減碼" || card.adviceKeyword === "避開";

  const borderLeftColor = isBullish
    ? "border-l-red-500"
    : isBearish
    ? "border-l-green-500"
    : "border-l-border";

  const badgeClass = isBullish
    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
    : isBearish
    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
    : "bg-muted text-muted-foreground";

  return (
    <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm">
      {/* Header — 標題 + 標的 + badge */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left min-h-[48px] bg-[#113153] hover:bg-[#17406a] dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
      >
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold text-white leading-snug">{card.title}</h3>
            {card.adviceKeyword && (
              <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
                {card.adviceKeyword}
              </span>
            )}
          </div>
          {card.stocks.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {card.stocks.map((s) => {
                let url = null;
                const twMatch = s.match(/(\d{4,5})$/);
                if (twMatch) {
                  url = `https://tw.stock.yahoo.com/quote/${twMatch[1]}`;
                } else if (/^[A-Z]{1,5}$/.test(s)) {
                  url = `https://finance.yahoo.com/quote/${s}`;
                } else if (/^[A-Za-z0-9\s]+$/.test(s)) {
                  url = `https://finance.yahoo.com/lookup?s=${encodeURIComponent(s)}`;
                }
                const cls = "text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-colors";
                return url ? (
                  <a key={s} href={url} target="_blank" rel="noopener noreferrer" className={cls}>
                    {s}
                  </a>
                ) : (
                  <span key={s} className={cls}>{s}</span>
                );
              })}
            </div>
          )}
        </div>
        <ChevronIcon open={open} />
      </button>

      {/* Body — 純文字分析 */}
      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="bg-muted/20 px-5 py-4 space-y-3">
            <p className="text-sm leading-relaxed text-foreground/80">{card.logic}</p>
            {card.advice && card.advice !== card.logic && (
              <p className="text-sm leading-relaxed text-foreground/70">
                {card.advice}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionCardList({ cards }: { cards: SectionCard[] }) {
  if (cards.length === 0) return null;
  return (
    <div className="space-y-4">

      <div className="flex flex-col gap-3">
        {cards.map((card, i) => (
          <SectionCardItem key={i} card={card} />
        ))}
      </div>
    </div>
  );
}
