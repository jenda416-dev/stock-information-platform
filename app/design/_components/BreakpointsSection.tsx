const breakpoints = [
  {
    prefix: "sm:",
    px: "640px",
    usage: "tablet，次要調整",
    example: "sm:grid-cols-2",
  },
  {
    prefix: "md:",
    px: "768px",
    usage: "desktop，Nav 切換（hidden md:flex / md:hidden）",
    example: "hidden md:flex",
    highlight: true,
  },
  {
    prefix: "lg:",
    px: "1024px",
    usage: "大版型，側欄 grid",
    example: "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]",
  },
];

export function BreakpointsSection() {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[64px_72px_1fr] gap-4 px-4 py-2 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prefix</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">px</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">用途 / 範例</span>
        </div>
        {breakpoints.map(({ prefix, px, usage, example, highlight }) => (
          <div
            key={prefix}
            className={`grid grid-cols-[64px_72px_1fr] gap-4 px-4 py-3.5 border-b border-border/40 last:border-0 items-start ${highlight ? "bg-primary/5" : ""}`}
          >
            <code className={`text-sm font-mono ${highlight ? "text-primary font-semibold" : "text-foreground/80"}`}>
              {prefix}
            </code>
            <span className="text-sm font-mono text-muted-foreground">{px}</span>
            <div className="space-y-1">
              <p className="text-sm text-foreground/80">{usage}</p>
              <code className="text-xs font-mono text-muted-foreground">{example}</code>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Mobile-first。使用 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">sm:</code> / <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">md:</code> / <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">lg:</code> 由小至大覆蓋。
      </p>
    </div>
  );
}
