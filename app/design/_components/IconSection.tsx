const iconSizes = [
  { cls: "w-3 h-3", label: "w-3 h-3", usage: "tag 內、密集資訊" },
  { cls: "w-4 h-4", label: "w-4 h-4", usage: "一般 UI 按鈕、inline", highlight: true },
  { cls: "w-5 h-5", label: "w-5 h-5", usage: "Nav、強調元件" },
];

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function IconSection() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-mono text-muted-foreground">尺寸規範</p>
          <div className="flex flex-wrap items-end gap-6">
            {iconSizes.map(({ cls, label, usage, highlight }) => (
              <div key={label} className="space-y-2 text-center">
                <div className="flex items-center justify-center h-8">
                  <ChevronIcon className={`${cls} ${highlight ? "text-primary" : "text-foreground/60"}`} />
                </div>
                <code className={`text-xs font-mono block ${highlight ? "text-primary font-semibold" : "text-foreground/70"}`}>{label}</code>
                <p className="text-xs text-muted-foreground">{usage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border/50 pt-4 space-y-3">
          <p className="text-sm font-mono text-muted-foreground">範例 — inline SVG，顏色繼承父層</p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">
              查看更多
              <ExternalLinkIcon className="w-3 h-3 flex-shrink-0" />
            </button>
            <div className="inline-flex items-center gap-1 text-sm text-red-500 dark:text-red-400">
              <TrendUpIcon className="w-4 h-4 flex-shrink-0" />
              上漲
            </div>
            <button className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-foreground bg-primary rounded-md px-2.5 py-1 hover:bg-primary/90 transition-all duration-150">
              展開
              <ChevronIcon className="w-3 h-3 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-muted/40 rounded-lg px-4 py-3 space-y-1">
        <p className="text-sm text-foreground/80">禁止使用 emoji，改用 inline SVG，確保跨平台一致。</p>
        <p className="text-sm text-foreground/80">裝飾性 icon 加 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">aria-hidden="true"</code>。顏色繼承父層：<code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">currentColor</code>。</p>
        <p className="text-sm text-foreground/80">Flex 排列時加 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">flex-shrink-0</code> 防止壓縮。</p>
      </div>
    </div>
  );
}
