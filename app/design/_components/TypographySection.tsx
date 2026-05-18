export function TypographySection() {
  const samples = [
    { label: "text-lg sm:text-xl font-bold leading-snug", el: <p className="text-xl font-bold leading-snug">頁面標題 Page Title</p> },
    { label: "text-base font-semibold", el: <p className="text-base font-semibold">Section 標題 Section Title</p> },
    { label: "text-[15px] font-bold leading-snug", el: <p className="text-[15px] font-bold leading-snug">卡片子標題 Card Subtitle</p> },
    { label: "text-[15px] leading-[1.8] text-foreground/80", el: <p className="text-[15px] leading-[1.8] text-foreground/80">內文正文。資金狂潮下的生存指南，面對市場修正，如何找到長線佈局的好時機。</p> },
    { label: "text-sm leading-relaxed text-foreground/80", el: <p className="text-sm leading-relaxed text-foreground/80">次要內文 Secondary body text，用於卡片摘要或補充說明。</p> },
    { label: "text-xs text-muted-foreground", el: <p className="text-xs text-muted-foreground">標籤 · 時間戳 · 大約 19 小時前</p> },
    {
      label: "text-[11px] font-mono font-semibold（時間軸）",
      el: <span className="inline font-mono text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">03:42</span>,
    },
  ];

  return (
    <div className="space-y-4 bg-card rounded-xl border border-border p-6">
      {samples.map(({ label, el }, i) => (
        <div key={i} className="border-b border-border/50 pb-4">
          <p className="text-sm font-mono text-muted-foreground mb-1">{label}</p>
          {el}
        </div>
      ))}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-foreground">文字色彩使用規則</p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <code className="text-xs font-mono text-muted-foreground w-52 flex-shrink-0">text-foreground</code>
            <span className="text-sm text-foreground w-28 flex-shrink-0">主要標題</span>
            <span className="text-xs text-muted-foreground">主要標題、label、強調文字</span>
          </div>
          <div className="flex items-center gap-3">
            <code className="text-xs font-mono text-muted-foreground w-52 flex-shrink-0">text-foreground/80</code>
            <span className="text-sm text-foreground/80 w-28 flex-shrink-0">內文說明</span>
            <span className="text-xs text-muted-foreground">內文、說明文字</span>
          </div>
          <div className="flex items-center gap-3">
            <code className="text-xs font-mono text-muted-foreground w-52 flex-shrink-0">text-muted-foreground</code>
            <span className="text-sm text-muted-foreground w-28 flex-shrink-0">輔助資訊</span>
            <span className="text-xs text-muted-foreground">placeholder、時間戳、次要輔助文字</span>
          </div>
          <div className="flex items-center gap-3">
            <code className="text-xs font-mono text-muted-foreground w-52 flex-shrink-0">text-destructive</code>
            <span className="text-sm text-destructive w-28 flex-shrink-0">錯誤訊息</span>
            <span className="text-xs text-muted-foreground">表單錯誤、警告文字</span>
          </div>
          <div className="flex items-center gap-3">
            <code className="text-xs font-mono text-muted-foreground w-52 flex-shrink-0">text-primary</code>
            <span className="text-sm text-primary w-28 flex-shrink-0">3,248 元</span>
            <span className="text-xs text-muted-foreground">強調數值（計算結果、核心指標）</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">同一 section 不要混用 text-foreground/80 與 text-muted-foreground，選一個層次即可。</p>
      </div>
    </div>
  );
}
