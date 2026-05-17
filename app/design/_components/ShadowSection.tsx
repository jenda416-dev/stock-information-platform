const shadowLevels = [
  {
    label: "（無陰影）",
    cls: "",
    usage: "靜止卡片（用 border 或 bg 色差製造層次）",
  },
  {
    label: "shadow-sm",
    cls: "shadow-sm",
    usage: "輕微浮起、資訊密集型卡片靜止狀態",
  },
  {
    label: "shadow-md",
    cls: "shadow-md",
    usage: "卡片 hover 狀態，配合 transition-all duration-200",
    badge: "hover 狀態",
  },
  {
    label: "shadow-lg",
    cls: "shadow-lg",
    usage: "Dropdown、Popover、Modal 等浮層元件",
  },
];

export function ShadowSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shadowLevels.map(({ label, cls, usage, badge }) => (
          <div
            key={label}
            className={`bg-card rounded-xl border border-border p-5 space-y-3 ${cls}`}
          >
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-foreground/80">{label}</code>
              {badge && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{usage}</p>
          </div>
        ))}
      </div>
      <div className="bg-muted/40 rounded-lg px-4 py-3 space-y-1">
        <p className="text-sm text-foreground/80">禁止使用 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">shadow-xl</code> 以上，視覺太重，不符設計語言。</p>
        <p className="text-sm text-foreground/80">Dark mode 下陰影較不明顯，以 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">bg-card</code> 與 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">bg-muted</code> 的色差製造層次，不加更深的陰影補償。</p>
      </div>
    </div>
  );
}
