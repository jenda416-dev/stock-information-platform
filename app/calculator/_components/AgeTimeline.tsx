"use client";

import { useState, useEffect } from "react";

const MIN_AGE = 1;
const MAX_AGE = 110;
const MIN_GAP = 1;

interface Props {
  currentAge: number;
  retirementAge: number;
  lifespan: number;
  onChange: (field: "current" | "retirement" | "lifespan", value: number) => void;
}

function ArrowConnector({ years, color }: { years: number; color: "primary" | "amber" }) {
  const isPrimary = color === "primary";
  return (
    <div className={`flex-1 flex flex-col items-center gap-1.5 px-3 ${isPrimary ? "text-primary" : "text-amber-500 dark:text-amber-400"}`}>
      <span className="text-[13px] font-medium whitespace-nowrap">
        {isPrimary ? "累積" : "提領"} {years} 年
      </span>
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className={`w-full h-2.5 ${isPrimary ? "text-primary/35" : "text-amber-300 dark:text-amber-500/50"}`}
        aria-hidden="true"
      >
        <line x1="0" y1="5" x2="88" y2="5" stroke="currentColor" strokeWidth="2" />
        <polygon points="86,1.5 100,5 86,8.5" fill="currentColor" />
      </svg>
    </div>
  );
}

const inputClass =
  "w-20 h-[42px] text-center text-[15px] font-bold rounded-lg bg-muted border-0 text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-shadow duration-150 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

export function AgeTimeline({ currentAge, retirementAge, lifespan, onChange }: Props) {
  const [raw, setRaw] = useState({
    current: String(currentAge),
    retirement: String(retirementAge),
    lifespan: String(lifespan),
  });

  useEffect(() => {
    setRaw({ current: String(currentAge), retirement: String(retirementAge), lifespan: String(lifespan) });
  }, [currentAge, retirementAge, lifespan]);

  function commit(field: "current" | "retirement" | "lifespan", rawVal: string) {
    const v = parseInt(rawVal, 10);
    if (isNaN(v)) return;
    if (field === "current") onChange("current", Math.max(MIN_AGE, Math.min(v, retirementAge - MIN_GAP)));
    else if (field === "retirement") onChange("retirement", Math.max(currentAge + MIN_GAP, Math.min(v, lifespan - MIN_GAP)));
    else onChange("lifespan", Math.max(retirementAge + MIN_GAP, Math.min(v, MAX_AGE)));
  }

  const accYears = retirementAge - currentAge;
  const retYears = lifespan - retirementAge;

  return (
    <div className="py-1 select-none">
      <div className="flex items-center">
        {/* 目前年齡 */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">目前年齡</span>
          <input
            type="number"
            value={raw.current}
            min={MIN_AGE} max={MAX_AGE}
            onChange={(e) => setRaw((p) => ({ ...p, current: e.target.value }))}
            onBlur={() => commit("current", raw.current)}
            onKeyDown={(e) => { if (e.key === "Enter") commit("current", raw.current); }}
            className={inputClass}
          />
        </div>

        <ArrowConnector years={accYears} color="primary" />

        {/* 退休年齡 */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">退休年齡</span>
          <input
            type="number"
            value={raw.retirement}
            min={MIN_AGE} max={MAX_AGE}
            onChange={(e) => setRaw((p) => ({ ...p, retirement: e.target.value }))}
            onBlur={() => commit("retirement", raw.retirement)}
            onKeyDown={(e) => { if (e.key === "Enter") commit("retirement", raw.retirement); }}
            className={inputClass}
          />
        </div>

        <ArrowConnector years={retYears} color="amber" />

        {/* 預估壽命 */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">預估壽命</span>
          <input
            type="number"
            value={raw.lifespan}
            min={MIN_AGE} max={MAX_AGE}
            onChange={(e) => setRaw((p) => ({ ...p, lifespan: e.target.value }))}
            onBlur={() => commit("lifespan", raw.lifespan)}
            onKeyDown={(e) => { if (e.key === "Enter") commit("lifespan", raw.lifespan); }}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
