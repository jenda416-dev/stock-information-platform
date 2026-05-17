export function LayoutSection() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <div className="space-y-3">
        <div className="relative h-10 bg-muted/50 rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-5xl h-full bg-primary/10 rounded-lg border border-primary/30 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">max-w-5xl — 首頁 / Nav</span>
            </div>
          </div>
        </div>
        <div className="relative h-10 bg-muted/50 rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-2xl h-full bg-primary/10 rounded-lg border border-primary/30 flex items-center justify-center mx-auto">
              <span className="text-xs font-medium text-primary">max-w-2xl — 次頁面</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">兩者都用 mx-auto px-4，新增頁面時需確認寬度一致。</p>
    </div>
  );
}
