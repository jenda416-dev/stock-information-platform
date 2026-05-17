"use client";

import { useState } from "react";
import { ResultCard } from "./ResultCard";
import { calcMonthlyDividend, calcMonthlyDividendByDps, formatMoney } from "@/lib/calculator";

const inputBase =
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-shadow duration-150 disabled:bg-muted disabled:text-muted-foreground disabled:border-border/50 disabled:cursor-not-allowed";

const PRINCIPAL_PRESETS = [
  { label: "100萬", value: "1000000" },
  { label: "300萬", value: "3000000" },
  { label: "500萬", value: "5000000" },
  { label: "1000萬", value: "10000000" },
];

// Update these values in February and August each year
const ANNUAL_DPS = 3.06;        // 元/share, 0050 2025 full-year dividend
const REFERENCE_PRICE = 148.5;  // 元/share, reference price at time of last update
const DIVIDEND_YEAR = 2025;

export function DividendCalculator() {
  const [principal, setPrincipal] = useState<string>("10000000");
  const [isPrincipalFocused, setIsPrincipalFocused] = useState(false);
  const [principalError, setPrincipalError] = useState(false);
  const annualDps = String(ANNUAL_DPS);
  const [isPrincipalEditing, setIsPrincipalEditing] = useState(false);

  const principalNum = Math.max(parseFloat(principal.replace(/,/g, "")) || 0, 0);
  const dpsNum = Math.max(parseFloat(annualDps) || 0, 0);

  const monthlyDividend = calcMonthlyDividendByDps(principalNum, REFERENCE_PRICE, dpsNum);
  const annualDividend = monthlyDividend * 12;

  return (
    <div className="space-y-3">
      {/* Input section */}
      <div className="pb-2 space-y-5">
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">一次投入金額</label>
            <div className="flex gap-1.5 flex-wrap">
              {PRINCIPAL_PRESETS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setPrincipal(value);
                    setPrincipalError(false);
                    if (isPrincipalEditing) setIsPrincipalEditing(false);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    principal === value && !isPrincipalEditing
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsPrincipalEditing(v => !v)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors flex items-center gap-1.5 ${
                  isPrincipalEditing || (!PRINCIPAL_PRESETS.some(p => p.value === principal) && !isPrincipalEditing)
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {!PRINCIPAL_PRESETS.some(p => p.value === principal) && !isPrincipalEditing 
                  ? `自訂 ${principal ? Number(principal).toLocaleString("zh-TW") : "0"}` 
                  : "自訂"}
              </button>
            </div>

            {isPrincipalEditing && (
              <div className="flex items-start gap-2 pt-1.5">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={isPrincipalFocused ? principal : (principal ? Number(principal).toLocaleString("zh-TW") : "")}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, "");
                      if (/[^0-9]/.test(raw)) {
                        setPrincipalError(true);
                        return;
                      }
                      setPrincipalError(false);
                      setPrincipal(raw);
                    }}
                    onFocus={() => setIsPrincipalFocused(true)}
                    onBlur={() => setIsPrincipalFocused(false)}
                    placeholder="例：10,000,000"
                    className={`${inputBase} ${principalError ? "border-destructive focus-visible:ring-destructive/40" : ""}`}
                    autoFocus
                  />
                  {principalError && (
                    <p className="text-xs text-destructive">請輸入有效的數字</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrincipalEditing(false)}
                  className="shrink-0 rounded-md bg-primary text-primary-foreground px-3 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors mt-0"
                >
                  完成
                </button>
              </div>
            )}
          </div>

          {/* Target & Rate Group */}
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

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label className="text-sm font-medium text-foreground">每股股息（元）</label>
                <div className="relative group">
                  <svg className="w-3.5 h-3.5 text-muted-foreground/60 cursor-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 bg-foreground text-background text-xs leading-relaxed rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-lg pointer-events-none">
                    股息資料以 {DIVIDEND_YEAR} 年全年為基準，每年 2 月、8 月更新。實際配息依頻率不同，此試算以年化平均分攤為月領。
                  </div>
                </div>
              </div>
              <input
                type="number"
                value={annualDps}
                disabled
                className={`${inputBase} w-full`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output section */}
      <div className="space-y-4">
        <ResultCard
          label="每月可領股息"
          value={formatMoney(monthlyDividend)}
          unit="元"
          sublabel="年配股息約"
          subvalue={`${formatMoney(annualDividend)} 元`}
        />
      </div>
    </div>
  );
}
