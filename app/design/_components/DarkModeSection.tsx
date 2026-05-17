const detectionOrder = [
  { step: "1", label: "localStorage", desc: "使用者手動切換後記憶的偏好" },
  { step: "2", label: "prefers-color-scheme", desc: "作業系統設定（fallback）" },
];

export function DarkModeSection() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-mono text-muted-foreground">偵測順序</p>
          <div className="space-y-2">
            {detectionOrder.map(({ step, label, desc }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step}
                </span>
                <div>
                  <code className="text-sm font-mono text-foreground/80">{label}</code>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border/50 pt-4 space-y-2">
          <p className="text-sm font-mono text-muted-foreground">色彩調整方式</p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground/80">
                個別元件需更深背景時，在元件層加{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">dark:bg-[oklch(0.20_0.02_264)]</code>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground/80">
                不要直接改全域{" "}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">--card</code>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-4 space-y-2">
          <p className="text-sm font-mono text-muted-foreground">切換邏輯</p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground/80">
                Class-based：<code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">.dark</code> 加在 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">&lt;html&gt;</code>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground/80">
                切換邏輯在 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">app/layout.tsx</code> inline script（避免閃白）
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground/80">
                禁止在元件內直接讀 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">localStorage</code>，應由 layout.tsx 的 inline script 處理。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
