export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
      <h2 className="text-base font-semibold">{children}</h2>
    </div>
  );
}

export function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
      {children}
    </h3>
  );
}
