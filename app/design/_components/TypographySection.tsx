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
        <div key={i} className={i < samples.length - 1 ? "border-b border-border/50 pb-4" : ""}>
          <p className="text-[11px] font-mono text-muted-foreground mb-1">{label}</p>
          {el}
        </div>
      ))}
    </div>
  );
}
