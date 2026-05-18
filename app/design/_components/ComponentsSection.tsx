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

// ─── Z-index Scale Demo ──────────────────────────────────────────────────────

function ZIndexDemo() {
  const layers = [
    { label: "Tooltip",              value: "z-10", usage: "info icon hover tooltip" },
    { label: "Dropdown / Popover",   value: "z-20", usage: "select 下拉、日期選擇器" },
    { label: "Modal / Drawer",       value: "z-30", usage: "全頁覆蓋對話框" },
    { label: "Notification / Toast", value: "z-40", usage: "系統通知，永遠在最上層" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-[140px_64px_1fr] gap-3 px-4 py-2 border-b border-border bg-muted/30">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">層級</span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">使用場景</span>
      </div>
      {layers.map(({ label, value, usage }) => (
        <div key={value} className="grid grid-cols-[140px_64px_1fr] gap-3 px-4 py-3 border-b border-border/40 last:border-0 items-center">
          <span className="text-sm text-foreground/80">{label}</span>
          <code className="text-sm font-mono text-primary">{value}</code>
          <span className="text-sm text-muted-foreground">{usage}</span>
        </div>
      ))}
      <p className="px-4 py-3 text-xs text-muted-foreground border-t border-border/40">
        新增浮層元件時從此表選值，不要使用 z-50 或更高。
      </p>
    </div>
  );
}

// ─── Cards Demo ──────────────────────────────────────────────────────────────

function CardsDemo() {
  return (
    <div className="space-y-3">
      <div className="bg-muted/30 rounded-lg border border-border/50 px-4 py-3">
        <p className="text-xs font-mono text-muted-foreground">
          Base class：<code className="text-foreground/80">rounded-lg border border-border bg-card p-4</code>
        </p>
      </div>
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

// ─── Option Pill Demo ────────────────────────────────────────────────────────

function OptionPillDemo() {
  const [selected, setSelected] = useState("12.6");
  const presets = [
    { label: "悲觀 8%", value: "8" },
    { label: "平均 12.6%", value: "12.6" },
    { label: "樂觀 17%", value: "17" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <div className="flex gap-1.5 flex-wrap">
        {presets.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelected(value)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              selected === value
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className="rounded-full border px-3 py-1 text-xs transition-colors flex items-center gap-1.5 border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          自訂
        </button>
      </div>
      <p className="text-sm font-mono text-muted-foreground">
        選中：border-primary bg-primary/10 text-primary · 未選：border-border text-muted-foreground
      </p>
    </div>
  );
}

// ─── Primary-tinted Card Demo ─────────────────────────────────────────────────

function PrimaryTintedCardDemo() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-primary/15 bg-primary/5 dark:bg-primary/10 overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="p-5">
          <p className="text-sm font-medium text-foreground mb-2">每月可領股息</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tabular-nums text-primary">3,248</span>
            <span className="text-base text-muted-foreground">元</span>
          </div>
          <p className="mt-3 pt-3 border-t border-border/50 text-sm text-muted-foreground">
            年配股息約<span className="font-semibold text-foreground ml-1">38,976 元</span>
          </p>
        </div>
      </div>
      <p className="text-sm font-mono text-muted-foreground">
        border-primary/15 · bg-primary/5 dark:bg-primary/10 · 頂部 glow line · 大數字：text-4xl font-bold tabular-nums text-primary
      </p>
    </div>
  );
}

// ─── Tooltip Demo ─────────────────────────────────────────────────────────────

function TooltipDemo() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">預估年化報酬率</span>
        <div className="relative group flex items-center justify-center">
          <svg
            className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-foreground text-background text-[13px] leading-relaxed rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-lg pointer-events-none">
            Hover 此 icon 可見 tooltip。陰影用 <span className="font-mono">shadow-lg</span>，禁用 <span className="font-mono">shadow-xl</span> 以上。
            <div className="absolute top-full left-2 border-4 border-transparent border-t-foreground" />
          </div>
        </div>
      </div>
      <p className="text-sm font-mono text-muted-foreground">
        group-hover · bg-foreground text-background · shadow-lg · pointer-events-none
      </p>
    </div>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function ComponentsSection() {
  return (
    <div className="space-y-10">
      <div>
        <SubTitle>Z-index Scale</SubTitle>
        <ZIndexDemo />
      </div>

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

      <div>
        <SubTitle>Option Pill（選項膠囊按鈕）</SubTitle>
        <OptionPillDemo />
      </div>

      <div>
        <SubTitle>Primary-tinted 卡片 ＆ 大數字展示</SubTitle>
        <PrimaryTintedCardDemo />
      </div>

      <div>
        <SubTitle>Tooltip</SubTitle>
        <TooltipDemo />
      </div>
    </div>
  );
}
