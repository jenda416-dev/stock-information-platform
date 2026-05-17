const durations = [
  {
    token: "duration-150",
    ms: "150ms",
    usage: "按鈕 press（active:scale）",
    example: "active:scale-[0.97] transition-all duration-150",
    highlight: false,
  },
  {
    token: "duration-200",
    ms: "200ms",
    usage: "一般 hover（顏色、陰影、透明度）",
    example: "hover:shadow-md transition-all duration-200",
    highlight: true,
  },
  {
    token: "duration-300",
    ms: "300ms",
    usage: "展開／收合動畫（grid-rows、opacity）",
    example: "transition-all duration-300 ease-in-out",
    highlight: false,
  },
];

const properties = [
  { cls: "transition-colors",    usage: "背景色、文字色、border-color" },
  { cls: "transition-all",       usage: "同時跑多個屬性（shadow + color 等）" },
  { cls: "transition-opacity",   usage: "淡入淡出" },
  { cls: "transition-transform", usage: "縮放、位移（單獨使用，避免觸發 layout）" },
];

export function TransitionSection() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[120px_60px_1fr] gap-4 px-4 py-2 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Token</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ms</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">用途 / 範例</span>
        </div>
        {durations.map(({ token, ms, usage, example, highlight }) => (
          <div
            key={token}
            className={`grid grid-cols-[120px_60px_1fr] gap-4 px-4 py-3 border-b border-border/40 last:border-0 items-start ${highlight ? "bg-primary/5" : ""}`}
          >
            <code className={`text-sm font-mono ${highlight ? "text-primary font-semibold" : "text-foreground/80"}`}>
              {token}
            </code>
            <span className="text-sm font-mono text-muted-foreground">{ms}</span>
            <div className="space-y-1 min-w-0">
              <p className="text-sm text-foreground/80">{usage}</p>
              <code className="text-xs font-mono text-muted-foreground break-all">{example}</code>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[200px_1fr] gap-4 px-4 py-2 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Utility</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">適用屬性</span>
        </div>
        {properties.map(({ cls, usage }) => (
          <div key={cls} className="grid grid-cols-[200px_1fr] gap-4 px-4 py-3 border-b border-border/40 last:border-0 items-center">
            <code className="text-sm font-mono text-foreground/80">{cls}</code>
            <span className="text-sm text-muted-foreground">{usage}</span>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <p className="text-sm font-mono text-muted-foreground">視覺對照 — hover 三個按鈕感受速度差異</p>
        <div className="flex flex-wrap gap-4 items-center">
          {durations.map(({ token, ms }) => (
            <div key={token} className="space-y-1.5 text-center">
              <button
                className={`h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-medium transition-all ${token} hover:bg-primary/80 hover:shadow-md active:scale-[0.97]`}
              >
                {ms}
              </button>
              <p className="text-xs font-mono text-muted-foreground">{token}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/40 rounded-lg px-4 py-3 space-y-1">
        <p className="text-sm text-foreground/80">Easing 統一用 Tailwind 預設（<code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">ease-in-out</code>），展開動畫才明確加。</p>
        <p className="text-sm text-foreground/80">禁止使用 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">hover:-translate-y-*</code>，改用 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">hover:shadow-md</code> 表現懸浮感。</p>
      </div>
    </div>
  );
}
