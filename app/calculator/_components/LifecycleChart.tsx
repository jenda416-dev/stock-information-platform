"use client";

import { useState } from "react";
import {
  calcLifecycleAccumulation,
  calcLifecycleDrawdown,
  formatWan,
} from "@/lib/calculator";

const SVG_W = 350;
const SVG_H = 200;
const PHASE_H = 20;
const CHART_TOP = 30;
const CHART_BOTTOM = 175;
const CHART_H = CHART_BOTTOM - CHART_TOP;

interface Props {
  currentAge: number;
  retirementAge: number;
  lifespan: number;
  initialAmt: number;
  monthlyAmt: number;
  annualRate: number;
  retirementAsset: number;
  savingsAtRetirement: number;
  monthlyWithdrawal: number;
}

export function LifecycleChart({
  currentAge,
  retirementAge,
  lifespan,
  initialAmt,
  monthlyAmt,
  annualRate,
  retirementAsset,
  savingsAtRetirement,
  monthlyWithdrawal,
}: Props) {
  const [hoverX, setHoverX] = useState<number | null>(null);

  const totalYears = lifespan - currentAge;
  if (totalYears <= 0) return null;

  const retirementX = ((retirementAge - currentAge) / totalYears) * SVG_W;
  const savingsRatio =
    retirementAsset > 0
      ? Math.min(savingsAtRetirement / retirementAsset, 1)
      : 0;

  const ages = Array.from({ length: totalYears + 1 }, (_, i) => currentAge + i);
  const data = ages.map((age) => {
    let total: number;
    let savings: number;
    if (age <= retirementAge) {
      const m = (age - currentAge) * 12;
      total = calcLifecycleAccumulation(initialAmt, monthlyAmt, annualRate, m);
      savings = Math.min(initialAmt + monthlyAmt * m, total);
    } else {
      const m = (age - retirementAge) * 12;
      total = calcLifecycleDrawdown(retirementAsset, monthlyWithdrawal, annualRate, m);
      savings = total * savingsRatio;
    }
    return { age, total: Math.max(0, total), savings: Math.max(0, savings) };
  });

  const maxVal = Math.max(retirementAsset, 1);
  const xPos = (age: number) => ((age - currentAge) / totalYears) * SVG_W;
  const yPos = (val: number) => CHART_BOTTOM - (val / maxVal) * CHART_H;

  const totalAreaD =
    `M ${xPos(currentAge)} ${CHART_BOTTOM} ` +
    data.map((d) => `L ${xPos(d.age).toFixed(1)} ${yPos(d.total).toFixed(1)}`).join(" ") +
    ` L ${xPos(lifespan)} ${CHART_BOTTOM} Z`;

  const savingsAreaD =
    `M ${xPos(currentAge)} ${CHART_BOTTOM} ` +
    data.map((d) => `L ${xPos(d.age).toFixed(1)} ${yPos(d.savings).toFixed(1)}`).join(" ") +
    ` L ${xPos(lifespan)} ${CHART_BOTTOM} Z`;

  const hoverAge =
    hoverX !== null
      ? Math.min(Math.max(Math.round(currentAge + (hoverX / SVG_W) * totalYears), currentAge), lifespan)
      : null;
  const hoverData = hoverAge !== null ? data.find((d) => d.age === hoverAge) ?? null : null;

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * SVG_W;
    setHoverX(Math.max(0, Math.min(SVG_W, x)));
  }

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="w-full h-auto cursor-crosshair"
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverX(null)}
    >
      {/* Header labels */}
      <text x="2" y="11" fontSize="8" className="fill-muted-foreground">
        初期投入
      </text>
      <text x="2" y="23" fontSize="9" fontWeight="600" className="fill-muted-foreground">
        {formatWan(initialAmt)}
      </text>

      <text x={retirementX} y="11" textAnchor="middle" fontSize="7.5" className="fill-muted-foreground">
        累積退休金
      </text>
      <text x={retirementX} y="23" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-muted-foreground">
        {formatWan(retirementAsset)}
      </text>

      <text x={SVG_W - 2} y="11" textAnchor="end" fontSize="8" className="fill-muted-foreground">
        退休金用完
      </text>
      <text x={SVG_W - 2} y="23" textAnchor="end" fontSize="9" fontWeight="600" className="fill-muted-foreground">
        0
      </text>

      {/* Chart fills — amber (gains) first, then blue (savings) on top */}
      <path d={totalAreaD} className="fill-amber-50 dark:fill-amber-700/20 stroke-amber-200 dark:stroke-amber-600/40" strokeWidth="0.5" />
      <path d={savingsAreaD} className="fill-sky-200 dark:fill-sky-400/25" />

      {/* Vertical dashed line at retirement */}
      <line
        x1={retirementX.toFixed(1)}
        y1={CHART_TOP}
        x2={retirementX.toFixed(1)}
        y2={CHART_BOTTOM}
        strokeWidth="1"
        strokeDasharray="4 3"
        className="stroke-primary/50"
      />

      {/* X-axis labels */}
      <text x="2" y={SVG_H - 4} fontSize="9" className="fill-muted-foreground">
        {currentAge}歲
      </text>
      <text x={retirementX} y={SVG_H - 4} textAnchor="middle" fontSize="9" className="fill-muted-foreground">
        {retirementAge}歲
      </text>
      <text x={SVG_W - 2} y={SVG_H - 4} textAnchor="end" fontSize="9" className="fill-muted-foreground">
        {lifespan}歲
      </text>
      {/* Hover crosshair + tooltip */}
      {hoverX !== null && hoverData && (() => {
        const dotY = yPos(hoverData.total);
        const investGains = Math.max(0, hoverData.total - hoverData.savings);
        const tipW = 112;
        const tipH = 64;
        const tipX = hoverX > SVG_W / 2 ? hoverX - tipW - 6 : hoverX + 6;
        const tipY = Math.max(CHART_TOP + 2, Math.min(CHART_BOTTOM - tipH - 2, dotY - tipH / 2));
        const valX = tipX + tipW - 8;
        return (
          <g>
            <line
              x1={hoverX.toFixed(1)} y1={CHART_TOP}
              x2={hoverX.toFixed(1)} y2={CHART_BOTTOM}
              strokeWidth="0.5" strokeDasharray="2 2"
              className="stroke-foreground/30"
            />
            <circle cx={hoverX.toFixed(1)} cy={dotY.toFixed(1)} r="2.5" className="fill-primary" />
            <rect x={tipX} y={tipY} width={tipW} height={tipH} rx="4" className="fill-foreground/85" />
            <text x={tipX + 8} y={tipY + 13} fontSize="9" fontWeight="600" className="fill-background">
              {hoverData.age} 歲
            </text>
            <line x1={tipX + 6} y1={tipY + 18} x2={tipX + tipW - 6} y2={tipY + 18} strokeWidth="0.5" className="stroke-background/25" />
            <text x={tipX + 8} y={tipY + 31} fontSize="7.5" className="fill-background/65">儲蓄</text>
            <text x={valX} y={tipY + 31} fontSize="7.5" textAnchor="end" fontWeight="500" className="fill-background">{formatWan(hoverData.savings)}</text>
            <text x={tipX + 8} y={tipY + 44} fontSize="7.5" className="fill-background/65">投資收益</text>
            <text x={valX} y={tipY + 44} fontSize="7.5" textAnchor="end" fontWeight="500" className="fill-background">{formatWan(investGains)}</text>
            <text x={tipX + 8} y={tipY + 57} fontSize="7.5" className="fill-background/65">資產市值</text>
            <text x={valX} y={tipY + 57} fontSize="7.5" textAnchor="end" fontWeight="500" className="fill-background">{formatWan(hoverData.total)}</text>
          </g>
        );
      })()}
    </svg>
  );
}
