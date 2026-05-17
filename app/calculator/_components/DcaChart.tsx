"use client";

import { useState, useEffect } from "react";
import { calcDcaFv, formatWan } from "@/lib/calculator";

const DATA_YEARS = [3, 5, 10, 15, 20, 30];
const BAR_MAX_PX = 160;

interface Props {
  pmt: number;
  annualRate: number;
  highlightYear?: number;
}

export function DcaChart({ pmt, annualRate, highlightYear }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const points = DATA_YEARS.map((year) => ({
    year,
    value: calcDcaFv(pmt, annualRate, year),
  }));

  const visiblePoints = highlightYear ? points.filter((p) => p.year <= highlightYear) : points;
  const maxValue = Math.max(...visiblePoints.map((p) => p.value), 1);

  return (
    <div className="space-y-1">
      <div className="flex items-end" style={{ height: "200px" }}>
        {points.map(({ year, value }) => {
          const visible = !highlightYear || year <= highlightYear;
          const barPx = Math.max((value / maxValue) * BAR_MAX_PX, 4);
          return (
            <div
              key={year}
              className="flex flex-col items-center justify-end gap-1.5"
              style={{
                flex: visible ? 1 : 0,
                opacity: visible ? 1 : 0,
                overflow: "hidden",
                minWidth: 0,
                padding: visible ? "0 6px" : "0",
                transition: "flex 450ms ease-in-out, opacity 350ms ease-in-out, padding 450ms ease-in-out",
              }}
              title={`${year}年後：${Math.round(value).toLocaleString("zh-TW")} 元`}
            >
              <span className="text-[11px] font-bold text-primary tabular-nums leading-none whitespace-nowrap">
                {formatWan(value)}
              </span>
              <div
                className={`w-full rounded-t-sm transition-all duration-700 ease-out ${
                  year === highlightYear
                    ? "bg-primary/60 dark:bg-primary/80"
                    : "bg-primary/20 dark:bg-primary/35"
                }`}
                style={{ height: mounted && visible ? `${barPx}px` : "0px" }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex mt-2">
        {points.map(({ year }) => {
          const visible = !highlightYear || year <= highlightYear;
          return (
            <div
              key={year}
              style={{
                flex: visible ? 1 : 0,
                opacity: visible ? 1 : 0,
                overflow: "hidden",
                minWidth: 0,
                padding: visible ? "0 6px" : "0",
                transition: "flex 450ms ease-in-out, opacity 350ms ease-in-out, padding 450ms ease-in-out",
              }}
              className="text-center"
            >
              <span className="text-xs text-muted-foreground whitespace-nowrap">{year}年後</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
