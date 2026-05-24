"use client";

import { useState } from "react";
import {
  calcLifecycleAccumulation,
  calcLifecycleWithdrawal,
  formatWanParts,
} from "@/lib/calculator";
import { LifecycleChart } from "./LifecycleChart";
import { AgeTimeline } from "./AgeTimeline";
import { inputBase } from "./constants";

const AMT_PRESETS = ["3000", "10000", "20000"];

const RATE_PRESETS = [
  { label: "悲觀", value: "8" },
  { label: "平均", value: "12.6" },
  { label: "樂觀", value: "17" },
];


export function LifecycleCalculator() {
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("60");
  const [lifespan, setLifespan] = useState("90");
  const [initialAmt, setInitialAmt] = useState("500000");
  const [monthlyAmt, setMonthlyAmt] = useState("20000");
  const [annualRate, setAnnualRate] = useState("8");
  const [isAmtEditing, setIsAmtEditing] = useState(false);
  const [isRateEditing, setIsRateEditing] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const isCustomRate = !RATE_PRESETS.some((p) => p.value === annualRate);

  function displayMoney(raw: string, field: string) {
    if (focused === field) return raw;
    const n = Number(raw);
    return raw && isFinite(n) ? n.toLocaleString("zh-TW") : raw;
  }

  function handleMoneyChange(setter: (v: string) => void, val: string) {
    const raw = val.replace(/,/g, "");
    if (/^\d*$/.test(raw)) setter(raw);
  }

  const ca = parseInt(currentAge) || 0;
  const ra = parseInt(retirementAge) || 0;
  const ls = parseInt(lifespan) || 0;
  const initial = parseFloat(initialAmt) || 0;
  const monthly = parseFloat(monthlyAmt) || 0;
  const rate = parseFloat(annualRate) || 0;

  const isValid = ca > 0 && ra > ca && ls > ra && rate > 0;

  const accMonths = isValid ? (ra - ca) * 12 : 0;
  const retirementAsset = isValid
    ? calcLifecycleAccumulation(initial, monthly, rate, accMonths)
    : 0;
  const savingsAtRetirement = isValid
    ? Math.min(initial + monthly * accMonths, retirementAsset)
    : 0;
  const retMonths = isValid ? (ls - ra) * 12 : 0;
  const monthlyWithdrawal = isValid
    ? calcLifecycleWithdrawal(retirementAsset, rate, retMonths)
    : 0;

  return (
    <div className="space-y-5">
      {/* Form */}
      <div className="space-y-4">
        {/* 年齡 timeline */}
        <AgeTimeline
          currentAge={ca || 30}
          retirementAge={ra || 60}
          lifespan={ls || 90}
          onChange={(field, value) => {
            if (field === "current") setCurrentAge(String(value));
            else if (field === "retirement") setRetirementAge(String(value));
            else setLifespan(String(value));
          }}
        />

        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-5">
        {/* 初期投入 */}
        <div className="space-y-2">
          <label htmlFor="lc-initial" className="block text-sm font-medium text-foreground">
            目前已存多少錢
          </label>
          <input
            id="lc-initial"
            type="text"
            inputMode="numeric"
            value={displayMoney(initialAmt, "initial")}
            onFocus={() => setFocused("initial")}
            onBlur={() => setFocused(null)}
            onChange={(e) => handleMoneyChange(setInitialAmt, e.target.value)}
            placeholder="500,000"
            className={inputBase}
          />
        </div>

        {/* 每月定期定額 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">每月預計存入</label>
          <div className="flex gap-1.5 flex-wrap">
            {AMT_PRESETS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setMonthlyAmt(amt);
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
              onClick={() => setIsAmtEditing((v) => !v)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors flex items-center gap-1.5 ${
                isAmtEditing || (!AMT_PRESETS.includes(monthlyAmt) && !isAmtEditing)
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {!AMT_PRESETS.includes(monthlyAmt) && !isAmtEditing
                ? `自訂 ${Number(monthlyAmt).toLocaleString("zh-TW")}`
                : "自訂"}
            </button>
          </div>
          {isAmtEditing && (
            <div className="flex items-start gap-2 pt-1">
              <input
                type="text"
                inputMode="numeric"
                value={displayMoney(monthlyAmt, "monthly")}
                onFocus={() => setFocused("monthly")}
                onBlur={() => setFocused(null)}
                onChange={(e) => handleMoneyChange(setMonthlyAmt, e.target.value)}
                placeholder="例：3,000"
                className={inputBase}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsAmtEditing(false)}
                className="shrink-0 rounded-md bg-primary text-primary-foreground px-3 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                完成
              </button>
            </div>
          )}
        </div>

        {/* 預估年化報酬率 */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-foreground">每年平均報酬率</label>
            <div className="relative group flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <div className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-foreground text-background text-[13px] leading-relaxed rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-lg pointer-events-none">
                <p>
                  <strong className="font-semibold block mb-1">預設報酬率參考基準：</strong>
                  <span className="block">・平均 <span className="font-mono">12.6%</span>：0050 成立以來長期歷史含息年化報酬率。</span>
                  <span className="block">・悲觀 <span className="font-mono">8%</span>：參考全球股市長期均值，假設台股未來回歸平庸。</span>
                  <span className="block">・樂觀 <span className="font-mono">17%</span>：假設台灣半導體與 AI 產業持續強勢。</span>
                </p>
                <div className="absolute top-full left-2 border-4 border-transparent border-t-foreground" />
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {RATE_PRESETS.map(({ label, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setAnnualRate(value);
                  if (isRateEditing) setIsRateEditing(false);
                }}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  annualRate === value && !isRateEditing
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {label} {value}%
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsRateEditing((v) => !v)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors flex items-center gap-1.5 ${
                isRateEditing || (isCustomRate && !isRateEditing)
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {isCustomRate && !isRateEditing ? `自訂 ${annualRate}%` : "自訂"}
            </button>
          </div>

          {isRateEditing && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step={0.1}
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                placeholder="例：10.5"
                className={`${inputBase} flex-1`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsRateEditing(false)}
                className="shrink-0 rounded-md bg-primary text-primary-foreground px-3 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                完成
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Result */}
      {isValid && (
        <div className="space-y-4">
          {/* 每月可領 — primary result card */}
          <div className="rounded-lg border border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-950/15 p-4">
            <p className="text-sm text-amber-900 dark:text-amber-500 mb-1">退休後，每月可領</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tabular-nums text-amber-900 dark:text-amber-400">
                {formatWanParts(monthlyWithdrawal).value}
              </span>
              {formatWanParts(monthlyWithdrawal).unit && (
                <span className="text-base text-amber-900 dark:text-amber-500">
                  {formatWanParts(monthlyWithdrawal).unit}
                </span>
              )}
            </div>
          </div>

          {/* 圖表 card */}
          <div className="rounded-xl border border-primary/15 bg-primary/5 dark:bg-primary/10 overflow-hidden">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="p-5 space-y-4">

              {/* 退休時資產市值 */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">退休時，資產市值</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tabular-nums text-primary">
                    {formatWanParts(retirementAsset).value}
                  </span>
                  {formatWanParts(retirementAsset).unit && (
                    <span className="text-base text-muted-foreground">
                      {formatWanParts(retirementAsset).unit}
                    </span>
                  )}
                </div>
              </div>

              {/* 圖表容器 */}
              <div className="rounded-lg bg-background dark:bg-card border border-border/50 p-4">
                <LifecycleChart
                  currentAge={ca}
                  retirementAge={ra}
                  lifespan={ls}
                  initialAmt={initial}
                  monthlyAmt={monthly}
                  annualRate={rate}
                  retirementAsset={retirementAsset}
                  savingsAtRetirement={savingsAtRetirement}
                  monthlyWithdrawal={monthlyWithdrawal}
                />
              </div>

              {/* 圖例 */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-sky-200 dark:bg-sky-400/40" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">儲蓄</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-200 dark:bg-amber-700/20 dark:border-amber-600/40" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">投資收益</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                以複利公式試算，年化報酬率為歷史均值參考，不代表未來報酬。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
