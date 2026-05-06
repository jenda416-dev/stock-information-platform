"use client";

import { useState } from "react";
import type { SectionCard } from "@/types/kol";

function TargetIcon() {
  return (
    <svg className="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="15.5" r="5.5" /><path d="M21 2l-9.6 9.6M15.5 7.5l3 3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-white/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SectionCardItem({ card }: { card: SectionCard }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm">
      {/* Header — 可點擊展開/收合 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 bg-slate-700 dark:bg-slate-800 px-5 py-4 text-left min-h-[52px]"
      >
        <h3 className="text-base font-bold text-white leading-snug">{card.title}</h3>
        <ChevronIcon open={open} />
      </button>

      {/* Body */}
      {open && (
        <div className="bg-card divide-y divide-border/50">
          {/* 盤點標的 */}
          {card.stocks.length > 0 && (
          <div className="px-5 py-4 space-y-2.5">
            <div className="flex flex-wrap gap-2">
              {card.stocks.map((s) => (
                <span
                  key={s}
                  className="text-sm font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border/60"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          )}

          {/* 主委點評邏輯 */}
          <div className="px-5 py-4 space-y-2">
            <div className="flex items-center gap-2">
              <KeyIcon />
              <span className="text-sm font-semibold text-foreground">主委點評邏輯</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{card.logic}</p>
          </div>

          {/* 操作建議 */}
          <div className="px-5 py-4 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldIcon />
              <span className="text-sm font-semibold text-foreground">操作建議</span>
              <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                card.adviceKeyword === "買進" || card.adviceKeyword === "加碼"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  : card.adviceKeyword === "減碼" || card.adviceKeyword === "避開"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-muted text-muted-foreground"
              }`}>
                {card.adviceKeyword}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{card.advice}</p>
          </div>

        </div>
      )}
    </div>
  );
}

export function SectionCardList({ cards }: { cards: SectionCard[] }) {
  if (cards.length === 0) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
        <h2 className="text-base font-semibold">板塊分析</h2>
      </div>
      <div className="flex flex-col gap-3">
        {cards.map((card, i) => (
          <SectionCardItem key={i} card={card} />
        ))}
      </div>
    </div>
  );
}
