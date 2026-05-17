"use client";

import { useState } from "react";
import { SubTitle } from "./helpers";

// ─── Expandable Card Demo ────────────────────────────────────────────────────

function ExpandableDemo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left bg-[#113153] hover:bg-[#17406a] dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
      >
        <div className="space-y-1">
          <span className="text-sm font-semibold text-white">老AI板塊</span>
          <div className="flex gap-1.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">觀察</span>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-white/60 flex-shrink-0 mt-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="bg-muted/20 px-5 py-4 space-y-3">
            <p className="text-sm leading-relaxed text-foreground/80">
              毛利率疑慮僅是短期新舊產品交替的成本問題，長線仍有機會復甦，但短期面臨投信資金轉向台積電的籌碼提款壓力，建議先觀望。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Buttons Demo ────────────────────────────────────────────────────────────

function ButtonsDemo() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1.5 text-center">
          <button className="flex-shrink-0 text-xs font-medium text-primary-foreground bg-primary rounded-md px-2.5 py-1 hover:bg-primary/90 active:scale-[0.97] transition-all duration-150 cursor-pointer">
            查看筆記
          </button>
          <p className="text-sm font-mono text-muted-foreground">CTA</p>
        </div>
        <div className="space-y-1.5 text-center">
          <button className="text-primary text-xs font-medium hover:text-primary/80 active:text-primary/60 transition-colors cursor-pointer underline-offset-2 hover:underline">
            文字連結
          </button>
          <p className="text-sm font-mono text-muted-foreground">Link</p>
        </div>
        <div className="space-y-1.5 text-center">
          <button className="font-mono text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded hover:bg-primary/20 active:bg-primary/30 active:scale-[0.97] transition-all duration-150 cursor-pointer">
            12:34
          </button>
          <p className="text-sm font-mono text-muted-foreground">時間軸</p>
        </div>
        <div className="space-y-1.5 text-center">
          <button disabled className="text-xs font-medium text-primary-foreground bg-primary rounded-md px-2.5 py-1 opacity-50 cursor-not-allowed">
            已停用
          </button>
          <p className="text-sm font-mono text-muted-foreground">Disabled</p>
        </div>
      </div>
      <p className="text-sm font-mono text-muted-foreground">試試 hover 與 click，可以感受顏色變化與縮放回饋。</p>
    </div>
  );
}

// ─── Tags Demo ───────────────────────────────────────────────────────────────

function TagsDemo() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {["汰弱留強", "資金輪動", "被動元件缺貨潮", "美股資安軟體", "籌碼分析"].map((tag) => (
          <button
            key={tag}
            className="inline-flex items-center gap-0.5 text-[12px] font-medium px-2 py-0.5 rounded bg-muted/70 hover:bg-muted text-muted-foreground transition-colors duration-150 cursor-pointer"
          >
            <span className="opacity-40">#</span>
            {tag}
          </button>
        ))}
      </div>
      <p className="text-sm font-mono text-muted-foreground">hover 背景加深。</p>
    </div>
  );
}

// ─── Cards Demo ──────────────────────────────────────────────────────────────

function CardsDemo() {
  return (
    <div className="space-y-3">
      <div className="group bg-card dark:bg-[oklch(0.20_0.02_264)] rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="p-4">
          <p className="font-bold text-[15px] leading-snug group-hover:text-primary transition-colors">
            資金狂潮下的生存指南！大跌洗盤心法
          </p>
          <p className="text-sm leading-relaxed text-foreground/80 mt-1 line-clamp-2">
            本集主委除了分享對於台灣獨立遊戲團隊的投資理念以及照顧孩子化險為夷的辛路歷程...
          </p>
          <div className="border-t border-border/40 mt-3 pt-3 flex flex-wrap gap-1.5">
            {["汰弱留強", "資金輪動"].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-0.5 text-[12px] font-medium px-2 py-0.5 rounded bg-muted/70 text-muted-foreground">
                <span className="opacity-40">#</span>{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border border-l-4 border-l-red-500 overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer p-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">加權指數</p>
          <p className="text-xl font-bold tracking-tight tabular-nums mt-0.5">20,453</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold tabular-nums text-red-500 dark:text-red-400">+312.5</p>
          <p className="text-xs font-semibold tabular-nums text-red-500 dark:text-red-400">+1.55%</p>
        </div>
      </div>
      <p className="text-sm font-mono text-muted-foreground">hover 可見 shadow 與標題顏色變化。</p>
    </div>
  );
}

// ─── Interactive States Demo ─────────────────────────────────────────────────

function InteractiveStatesDemo() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="space-y-2">
          <button className="w-full h-9 rounded-md bg-primary text-primary-foreground text-xs font-medium">
            Default
          </button>
          <p className="text-sm text-muted-foreground font-mono">bg-primary</p>
        </div>
        <div className="space-y-2">
          <button className="w-full h-9 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            Hover 我
          </button>
          <p className="text-sm text-muted-foreground font-mono">hover:bg-primary/90</p>
        </div>
        <div className="space-y-2">
          <button className="w-full h-9 rounded-md bg-primary text-primary-foreground text-xs font-medium focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none">
            Tab Focus
          </button>
          <p className="text-sm text-muted-foreground font-mono">ring-[3px] ring-ring/50</p>
        </div>
        <div className="space-y-2">
          <button disabled className="w-full h-9 rounded-md bg-primary text-primary-foreground text-xs font-medium opacity-50 cursor-not-allowed">
            Disabled
          </button>
          <p className="text-sm text-muted-foreground font-mono">opacity-50</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground font-mono">
        過渡時長：duration-200（預設）· duration-150（按鈕 press）· duration-300（展開動畫）
      </p>
    </div>
  );
}

// ─── Markdown Elements ───────────────────────────────────────────────────────

function MarkdownDemo() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 px-5 py-4 text-[15px] leading-[1.8] text-foreground/80">
        這是 blockquote 引用區塊，用於重要摘要或主委語錄。
      </div>
      <div className="space-y-1">
        <p className="text-sm font-mono text-muted-foreground">行內 code：</p>
        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">npm run dev</code>
      </div>
    </div>
  );
}

// ─── Border Radius Demo ──────────────────────────────────────────────────────

function BorderRadiusDemo() {
  const radii = [
    { label: "rounded",    rem: "0.25rem / 4px",  usage: "Tag、時間軸按鈕、inline code" },
    { label: "rounded-md", rem: "0.375rem / 6px", usage: "Button、Input 等表單元件" },
    { label: "rounded-lg", rem: "0.5rem / 8px",   usage: "Card、一般容器", highlight: true },
    { label: "rounded-xl", rem: "0.75rem / 12px", usage: "Blockquote、特殊強調區塊" },
    { label: "rounded-2xl",rem: "1rem / 16px",    usage: "大型圖片容器、Featured card" },
    { label: "rounded-full",rem: "9999px",        usage: "Badge、Avatar、色條、進度條" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        {radii.map(({ label, rem, usage, highlight }) => (
          <div key={label} className="flex items-start gap-3">
            <div
              className={`w-10 h-10 flex-shrink-0 bg-primary/20 border-2 ${highlight ? "border-primary" : "border-primary/40"} ${label}`}
            />
            <div>
              <code className={`text-xs font-mono block ${highlight ? "text-primary font-semibold" : "text-foreground/80"}`}>{label}</code>
              <p className="text-xs text-muted-foreground">{rem}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{usage}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground font-mono">同一頁面混用的 radius 種類不超過 3 種。</p>
    </div>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function ComponentsSection() {
  return (
    <div className="space-y-10">
      <div>
        <SubTitle>Border Radius Scale</SubTitle>
        <BorderRadiusDemo />
      </div>

      <div>
        <SubTitle>Section 標題</SubTitle>
        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold">股癌 Gooaye 最新節目</h2>
          </div>
          <p className="text-sm font-mono text-muted-foreground">{`w-0.5 h-5 rounded-full bg-primary`}</p>
        </div>
      </div>

      <div>
        <SubTitle>可展開卡片</SubTitle>
        <ExpandableDemo />
      </div>

      <div>
        <SubTitle>按鈕</SubTitle>
        <ButtonsDemo />
      </div>

      <div>
        <SubTitle>Tags（關鍵字標籤）</SubTitle>
        <TagsDemo />
      </div>

      <div>
        <SubTitle>Badge / 小標籤</SubTitle>
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">中性</span>
            <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">多方</span>
            <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">空方</span>
            <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">主色</span>
          </div>
          <p className="text-sm font-mono text-muted-foreground">rounded-full · text-xs · px-2 py-0.5</p>
        </div>
      </div>

      <div>
        <SubTitle>卡片</SubTitle>
        <CardsDemo />
      </div>

      <div>
        <SubTitle>互動狀態</SubTitle>
        <InteractiveStatesDemo />
      </div>

      <div>
        <SubTitle>Markdown 內文元素</SubTitle>
        <MarkdownDemo />
      </div>
    </div>
  );
}
