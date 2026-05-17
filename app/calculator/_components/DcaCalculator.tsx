"use client";

import { useState } from "react";
import { DcaChart } from "./DcaChart";
import { ResultCard } from "./ResultCard";
import { calcDcaFv, formatWanParts } from "@/lib/calculator";

const inputBase =
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-shadow duration-150 disabled:bg-muted disabled:text-muted-foreground disabled:border-border/50 disabled:cursor-not-allowed";

const RATE_PRESETS = [
  { label: "悲觀", value: "8" },
  { label: "平均", value: "12.6" },
  { label: "樂觀", value: "17" },
];

const AMT_PRESETS = ["3000", "10000", "20000"];
const YEAR_PRESETS = ["10", "20", "30"];

function RateEditor({ annualRate, isEditing, onChange, onToggle }: {
  annualRate: string;
  isEditing: boolean;
  onChange: (v: string) => void;
  onToggle: () => void;
}) {
  const isCustom = !RATE_PRESETS.some(p => p.value === annualRate);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <label className="block text-sm font-medium text-foreground">預估年化報酬率</label>
        <div className="relative group flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          
          <div className="absolute bottom-full left-0 md:-left-4 mb-2 w-72 p-3 bg-foreground text-background text-[13px] leading-relaxed rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl pointer-events-none">
            <p className="space-y-1">
              <strong className="font-semibold block mb-1">預設報酬率參考基準：</strong>
              <span className="block">・平均 <span className="font-mono text-primary-foreground">12.6%</span>：0050 成立以來長期歷史含息年化報酬率。</span>
              <span className="block">・悲觀 <span className="font-mono text-primary-foreground">8%</span>：參考全球股市長期均值，假設台股未來紅利減退、回歸平庸。</span>
              <span className="block">・樂觀 <span className="font-mono text-primary-foreground">17%</span>：假設台灣半導體與 AI 產業持續強勢，享有超額報酬（近十年其實高達 21%）。</span>
            </p>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-2 md:left-5 border-4 border-transparent border-t-foreground"></div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-1.5 flex-wrap">
        {RATE_PRESETS.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              onChange(value);
              if (isEditing) onToggle();
            }}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              annualRate === value && !isEditing
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
            }`}
          >
            {label} {value}%
          </button>
        ))}
        <button
          type="button"
          onClick={onToggle}
          className={`rounded-full border px-3 py-1 text-xs transition-colors flex items-center gap-1.5 ${
            isEditing || (isCustom && !isEditing)
              ? "border-primary bg-primary/10 text-primary font-medium"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {isCustom && !isEditing ? `自訂 ${annualRate}%` : "自訂"}
        </button>
      </div>

      {isEditing && (
        <div className="flex items-center gap-2 pt-1.5">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={0.1}
            value={annualRate}
            onChange={(e) => onChange(e.target.value)}
            placeholder="例：10.5"
            className={`${inputBase} flex-1`}
            autoFocus
          />
          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 rounded-md bg-primary text-primary-foreground px-3 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            完成
          </button>
        </div>
      )}
    </div>
  );
}

export function DcaCalculator() {
  const [monthlyAmt, setMonthlyAmt] = useState<string>("3000");
  const [isAmtFocused, setIsAmtFocused] = useState(false);
  const [amtError, setAmtError] = useState(false);
  const [annualRate, setAnnualRate] = useState<string>("12.6");
  const [isRateEditing, setIsRateEditing] = useState(false);
  const [isAmtEditing, setIsAmtEditing] = useState(false);
  const [targetYear, setTargetYear] = useState<string>("20");

  const pmt = Math.max(parseFloat(monthlyAmt) || 0, 0);
  const rate = Math.max(parseFloat(annualRate) || 0, 0);
  const years = Math.max(parseInt(targetYear) || 0, 0);
  const fv = calcDcaFv(pmt, rate, years);

  return (
    <div className="space-y-3">
      {/* Input section */}
      <div className="pb-2 space-y-5">
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">每月存入</label>
            <div className="flex gap-1.5 flex-wrap">
              {AMT_PRESETS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setMonthlyAmt(amt);
                    setAmtError(false);
                    if (isAmtEditing) setIsAmtEditing(false);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    monthlyAmt === amt && !isAmtEditing
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  {Number(amt).toLocaleString("zh-TW")}元
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsAmtEditing(v => !v)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors flex items-center gap-1.5 ${
                  isAmtEditing || (!AMT_PRESETS.includes(monthlyAmt) && !isAmtEditing)
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {!AMT_PRESETS.includes(monthlyAmt) && !isAmtEditing 
                  ? `自訂 ${monthlyAmt ? Number(monthlyAmt).toLocaleString("zh-TW") : "0"}` 
                  : "自訂"}
              </button>
            </div>

            {isAmtEditing && (
              <div className="flex items-start gap-2 pt-1.5">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={isAmtFocused ? monthlyAmt : (monthlyAmt ? Number(monthlyAmt).toLocaleString("zh-TW") : "")}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, "");
                      if (/[^0-9]/.test(raw)) {
                        setAmtError(true);
                        return;
                      }
                      setAmtError(false);
                      setMonthlyAmt(raw);
                    }}
                    onFocus={() => setIsAmtFocused(true)}
                    onBlur={() => setIsAmtFocused(false)}
                    placeholder="例：3,000"
                    className={`${inputBase} ${amtError ? "border-destructive focus-visible:ring-destructive/40" : ""}`}
                    autoFocus
                  />
                  {amtError && (
                    <p className="text-xs text-destructive">請輸入有效的數字</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsAmtEditing(false)}
                  className="shrink-0 rounded-md bg-primary text-primary-foreground px-3 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors mt-0"
                >
                  完成
                </button>
              </div>
            )}
          </div>

          {/* Target & Rate Group */}
          <div className="rounded-xl border border-border/60 bg-card p-4 space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">存股標的</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted px-3 py-2.5 cursor-not-allowed select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">元大台灣50</span>
                    <span className="text-xs text-muted-foreground/60">0050</span>
                  </div>
                  <svg className="w-4 h-4 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground">目前僅支援 0050</p>
              </div>
            </div>

            <div>
              <RateEditor annualRate={annualRate} isEditing={isRateEditing} onChange={setAnnualRate} onToggle={() => setIsRateEditing((v) => !v)} />
            </div>
          </div>
        </div>
      </div>

      {/* Output section */}
      <div className="rounded-xl border border-primary/15 bg-primary/5 dark:bg-primary/10 overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">預估資產</p>
            <div className="flex gap-1">
              {YEAR_PRESETS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setTargetYear(y)}
                  className={`rounded-md border px-2.5 py-0.5 text-xs transition-colors ${
                    targetYear === y
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  {y}年
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tabular-nums text-primary">{formatWanParts(fv).value}</span>
            {formatWanParts(fv).unit && <span className="text-base text-muted-foreground">{formatWanParts(fv).unit}</span>}
          </div>
        </div>
        <div className="bg-background dark:bg-card rounded-lg border border-border/50 p-4">
          <DcaChart pmt={pmt} annualRate={rate} highlightYear={years} />
        </div>
        <p className="text-xs text-muted-foreground">
          以複利公式試算，年化報酬率為歷史均值參考，不代表未來報酬。
        </p>
        </div>
      </div>
    </div>
  );
}
