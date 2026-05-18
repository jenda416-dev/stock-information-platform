const donts = [
  { category: "動畫",      rule: "hover:-translate-y-*",                   reason: "浮起感太強，不符設計語言" },
  { category: "陰影",      rule: "shadow-xl 或更大",                        reason: "視覺過重" },
  { category: "色彩",      rule: "tag 用 bg-blue-* 或 inline style border", reason: "破壞色彩系統一致性" },
  { category: "按鈕",      rule: "CTA 用 outline 或 ghost variant",         reason: "主要行動按鈕需 solid primary" },
  { category: "色彩 token", rule: "直接改全域 --card",                      reason: "應在元件層加 dark:bg-[...] 覆蓋" },
  { category: "Dark mode", rule: "元件內直接讀 localStorage",               reason: "應由 layout.tsx 的 inline script 處理" },
  { category: "Icon",      rule: "使用 emoji",                              reason: "改用 inline SVG，確保跨平台一致" },
  { category: "Z-index",   rule: "z-50 或更高",                             reason: "應依 Z-index Scale 選值，避免層疊衝突" },
  { category: "Input",     rule: "disabled:opacity-50 淡化整個 input",      reason: "應用 disabled:bg-muted 明確顯示背景色變化" },
];

const dos = [
  { category: "卡片 hover",  rule: "hover:shadow-md transition-all duration-200" },
  { category: "色彩調整",    rule: "在元件加 dark:bg-[oklch(...)]，不動全域 token" },
  { category: "裝飾性 icon", rule: "加 aria-hidden=\"true\"" },
  { category: "台股漲跌色",  rule: "紅色（多）/ 綠色（空），參考色彩系統表格" },
  { category: "版面寬度",    rule: "次頁面統一 max-w-2xl，首頁 max-w-5xl" },
];

export function DosDontsSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" aria-hidden="true" />
          <h3 className="text-sm font-semibold">禁止（Don&apos;t）</h3>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_1fr] gap-3 px-4 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">類別</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">禁止行為</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">原因</span>
          </div>
          {donts.map(({ category, rule, reason }) => (
            <div key={rule} className="grid grid-cols-[80px_1fr_1fr] gap-3 px-4 py-3 border-b border-border/40 last:border-0 items-start">
              <span className="text-xs font-medium text-muted-foreground">{category}</span>
              <code className="text-sm font-mono text-red-500 dark:text-red-400 break-all">{rule}</code>
              <span className="text-sm text-muted-foreground">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" aria-hidden="true" />
          <h3 className="text-sm font-semibold">推薦（Do）</h3>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[120px_1fr] gap-3 px-4 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">類別</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">推薦做法</span>
          </div>
          {dos.map(({ category, rule }) => (
            <div key={category} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-3 border-b border-border/40 last:border-0 items-start">
              <span className="text-xs font-medium text-muted-foreground">{category}</span>
              <code className="text-sm font-mono text-emerald-600 dark:text-emerald-400 break-all">{rule}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
