import { SubTitle } from "./helpers";

const brandColors = [
  { label: "background",         light: "oklch(1 0 0)",            dark: "oklch(0.13 0.018 264)",   lightBorder: true },
  { label: "foreground",         light: "oklch(0.145 0 0)",        dark: "oklch(0.96 0.008 264)" },
  { label: "primary",            light: "oklch(0.476 0.185 264)",  dark: "oklch(0.623 0.214 259.8)" },
  { label: "primary-foreground", light: "oklch(0.985 0 0)",        dark: "oklch(0.13 0.018 264)",   lightBorder: true, darkBorder: true },
  { label: "card",               light: "oklch(0.99 0.003 264)",   dark: "oklch(0.25 0.02 264)",    lightBorder: true },
  { label: "muted",              light: "oklch(0.96 0.005 264)",   dark: "oklch(0.27 0.022 264)" },
  { label: "muted-foreground",   light: "oklch(0.52 0.02 264)",    dark: "oklch(0.62 0.04 264)" },
  { label: "border",             light: "oklch(0.90 0.012 264)",   dark: "oklch(1 0 0 / 16%)" },
  { label: "accent",             light: "oklch(0.95 0.015 264)",   dark: "oklch(0.29 0.028 264)" },
];

const marketColors = [
  { label: "上漲（多）", bg: "bg-red-500",          text: "text-red-500 dark:text-red-400",           badge: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400" },
  { label: "下跌（空）", bg: "bg-emerald-500",      text: "text-emerald-600 dark:text-emerald-400",   badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" },
  { label: "中性",       bg: "bg-muted-foreground", text: "text-muted-foreground",                    badge: "bg-muted text-muted-foreground" },
];

type BrandColor = { label: string; light: string; dark: string; lightBorder?: boolean; darkBorder?: boolean };

function ColorRow({ label, light, dark, lightBorder, darkBorder }: BrandColor) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[180px_1fr_1fr] items-center gap-3 py-3 border-b border-border/40 last:border-0">
      <span className="text-sm font-mono text-foreground/80 truncate">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`w-9 h-9 rounded-lg flex-shrink-0 ${lightBorder ? "border border-black/10" : ""}`}
          style={{ background: light }}
        />
        <span className="text-sm font-mono text-muted-foreground hidden sm:block truncate">{light}</span>
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`w-9 h-9 rounded-lg flex-shrink-0 ${darkBorder ? "border border-white/20" : ""}`}
          style={{ background: dark }}
        />
        <span className="text-sm font-mono text-muted-foreground hidden sm:block truncate">{dark}</span>
      </div>
    </div>
  );
}

export function ColorSection() {
  return (
    <div className="space-y-8">
      <div>
        <SubTitle>品牌色票</SubTitle>
        <div className="bg-card rounded-xl border border-border px-4 pt-2 pb-1">
          <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[180px_1fr_1fr] gap-3 py-2 border-b border-border mb-1">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Token</span>
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">亮色模式</span>
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">深色模式</span>
          </div>
          {brandColors.map((c) => (
            <ColorRow key={c.label} {...c} />
          ))}
        </div>
      </div>

      <div>
        <SubTitle>台股語意色（紅漲綠跌）</SubTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {marketColors.map((c) => (
            <div key={c.label} className="bg-card rounded-xl border border-border p-4 space-y-3">
              <div className={`h-8 w-8 rounded-lg ${c.bg}`} />
              <p className="text-sm font-semibold">{c.label}</p>
              <div className="space-y-1.5">
                <div className={`inline-flex items-center text-xs font-semibold ${c.text}`}>▲ 文字色</div>
                <div>
                  <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>Badge</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          ⚠ 台灣市場慣例：紅色 = 上漲，綠色 = 下跌，與歐美相反。
        </p>
      </div>
    </div>
  );
}
