"use client";

import { useState } from "react";
import { SubTitle } from "./helpers";

const inputBase =
  "w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-shadow duration-150 disabled:bg-muted disabled:text-muted-foreground disabled:border-border/50 disabled:cursor-not-allowed";

const inputError =
  "w-full rounded-md border border-destructive bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-destructive/40 transition-shadow duration-150";

function InputDemo() {
  const [val, setVal] = useState("");
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">預設狀態</label>
        <input
          type="text"
          placeholder="輸入關鍵字，例如：台積電"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className={inputBase}
        />
        <p className="text-xs font-mono text-muted-foreground">
          border-input · focus: ring-[3px] ring-ring/50
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          錯誤狀態
          <span className="ml-2 text-xs font-normal text-destructive">必填欄位</span>
        </label>
        <input
          type="text"
          placeholder="請輸入名稱"
          className={inputError}
          aria-invalid="true"
        />
        <p className="text-xs font-mono text-muted-foreground">
          border-destructive · focus: ring-destructive/40
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">停用狀態</label>
        <input
          type="text"
          placeholder="不可編輯"
          disabled
          className={inputBase}
        />
        <p className="text-xs font-mono text-muted-foreground">disabled: opacity-50 cursor-not-allowed</p>
      </div>
    </div>
  );
}

function SelectDemo() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Select</label>
        <div className="relative">
          <select
            className={`${inputBase} appearance-none pr-8 cursor-pointer`}
            defaultValue=""
          >
            <option value="" disabled>選擇時間範圍</option>
            <option>最近 7 天</option>
            <option>最近 30 天</option>
            <option>最近 3 個月</option>
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          appearance-none + 自訂 ChevronIcon（absolute right-2.5）
        </p>
      </div>
    </div>
  );
}

function TextareaDemo() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-2">
      <label className="text-sm font-medium text-foreground">Textarea</label>
      <textarea
        rows={4}
        placeholder="輸入筆記內容..."
        className={`${inputBase} resize-y min-h-[96px]`}
      />
      <p className="text-xs font-mono text-muted-foreground">
        resize-y · min-h-[96px]
      </p>
    </div>
  );
}

function InputPaddingDemo() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">一般表單 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">py-1.5</code></label>
          <input
            type="text"
            placeholder="例：關鍵字"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-shadow duration-150"
          />
          <p className="text-xs text-muted-foreground">一般搜尋、篩選等表單欄位</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">計算機 / 大點擊面積 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">py-2.5</code></label>
          <input
            type="text"
            placeholder="例：10,000"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-shadow duration-150"
          />
          <p className="text-xs text-muted-foreground">數字輸入、計算機等需要大點擊面積的欄位</p>
        </div>
      </div>
      <p className="text-xs font-mono text-muted-foreground">兩者 px-3 一致，同一頁面內統一使用同一種。</p>
    </div>
  );
}

function LabelNote() {
  return (
    <div className="bg-muted/40 rounded-lg px-4 py-3 space-y-1">
      <p className="text-sm text-foreground/80">
        Label：<code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">text-sm font-medium</code>，搭配欄位加 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">htmlFor</code>（可及性）。
      </p>
      <p className="text-sm text-foreground/80">
        錯誤訊息：<code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">text-xs text-destructive</code>，放在 input 下方，不蓋 placeholder。
      </p>
      <p className="text-sm text-foreground/80">
        Focus ring 統一用 <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">focus-visible:ring-[3px]</code>，鍵盤導航才顯示，mouse 點擊不觸發。
      </p>
    </div>
  );
}

export function FormSection() {
  return (
    <div className="space-y-8">
      <div>
        <SubTitle>Text Input</SubTitle>
        <InputDemo />
      </div>
      <div>
        <SubTitle>Select</SubTitle>
        <SelectDemo />
      </div>
      <div>
        <SubTitle>Textarea</SubTitle>
        <TextareaDemo />
      </div>
      <div>
        <SubTitle>Input Padding 變體</SubTitle>
        <InputPaddingDemo />
      </div>
      <LabelNote />
    </div>
  );
}
