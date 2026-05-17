const spacingTokens = [
  { token: "0.5", px: 2,  usage: "細分隔線、icon 微偏移" },
  { token: "1",   px: 4,  usage: "icon 與文字之間的 gap" },
  { token: "1.5", px: 6,  usage: "inline code padding（px-1.5）" },
  { token: "2",   px: 8,  usage: "tag / badge padding（px-2 py-0.5）" },
  { token: "3",   px: 12, usage: "次要元素 padding" },
  { token: "3.5", px: 14, usage: "SectionCardList 按鈕垂直 padding（py-3.5）" },
  { token: "4",   px: 16, usage: "卡片 padding、container px-4（主要單位）", highlight: true },
  { token: "5",   px: 20, usage: "blockquote padding（px-5）" },
  { token: "6",   px: 24, usage: "section 間 flex gap" },
  { token: "8",   px: 32, usage: "頁面垂直節奏" },
  { token: "12",  px: 48, usage: "error / empty state 留白（py-12）" },
  { token: "16",  px: 64, usage: "大 empty state（py-16）" },
];

export function SpacingSection() {
  const maxPx = 64;
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[72px_60px_1fr] gap-4 px-4 py-2 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Token</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">px</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">預覽 / 用途</span>
        </div>
        {spacingTokens.map(({ token, px, usage, highlight }) => (
          <div
            key={token}
            className={`grid grid-cols-[72px_60px_1fr] gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 items-center ${highlight ? "bg-primary/5" : ""}`}
          >
            <code className={`text-sm font-mono ${highlight ? "text-primary font-semibold" : "text-foreground/80"}`}>
              {token}
            </code>
            <span className="text-sm font-mono text-muted-foreground">{px}px</span>
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="h-3 bg-primary/40 rounded-sm flex-shrink-0"
                style={{ width: `${Math.max((px / maxPx) * 96, 3)}px` }}
              />
              <span className="text-sm text-muted-foreground truncate">{usage}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-muted/40 rounded-lg px-4 py-3 space-y-1">
        <p className="text-sm text-foreground/80">卡片內 padding 預設 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">p-4</code>，資訊密集版面改 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">px-4 py-3</code></p>
        <p className="text-sm text-foreground/80">section 間距用 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">gap-6</code> 或 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">gap-8</code>，不用 gap-10 以上</p>
        <p className="text-sm text-foreground/80">inline 元素（tag、badge）padding 固定 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">px-2 py-0.5</code></p>
      </div>
    </div>
  );
}
