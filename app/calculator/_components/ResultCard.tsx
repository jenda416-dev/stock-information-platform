import { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  unit?: string;
  sublabel?: string;
  subvalue?: string;
  extra?: ReactNode;
  bare?: boolean;
}

export function ResultCard({ label, value, unit, sublabel, subvalue, extra, bare }: Props) {
  return (
    <div className={bare ? "" : "rounded-xl border border-primary/15 bg-primary/5 dark:bg-primary/10 overflow-hidden"}>
      {!bare && <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />}
      <div className={bare ? "" : "p-6"}>
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tabular-nums text-primary">{value}</span>
          {unit && <span className="text-base text-muted-foreground">{unit}</span>}
        </div>
        {sublabel && subvalue && (
          <p className="mt-3 pt-3 border-t border-border/50 text-sm text-muted-foreground">
            {sublabel}
            <span className="font-semibold text-foreground ml-1">{subvalue}</span>
          </p>
        )}
        {extra && (
          <div className={bare ? "mt-2" : "mt-3 pt-3 border-t border-border/50"}>
            {extra}
          </div>
        )}
      </div>
    </div>
  );
}
