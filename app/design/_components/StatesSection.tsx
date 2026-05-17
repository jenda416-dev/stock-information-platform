export function StatesSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-card rounded-xl border border-border p-4 space-y-3">
        <p className="text-sm font-mono text-muted-foreground mb-2">Skeleton</p>
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-full rounded bg-muted animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
      </div>

      <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-mono text-muted-foreground mb-3">Loading Text</p>
          <p className="text-sm text-muted-foreground">載入中...</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-center min-h-[100px]">
        <div className="text-center">
          <p className="text-sm font-mono text-muted-foreground mb-3">Empty State</p>
          <p className="text-sm text-muted-foreground">目前沒有資料</p>
          <p className="text-xs text-primary mt-1 cursor-pointer hover:text-primary/80 transition-colors">重新載入</p>
        </div>
      </div>
    </div>
  );
}
