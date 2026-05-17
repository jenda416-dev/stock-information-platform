export function calcDcaFv(pmt: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return pmt * n;
  return pmt * ((Math.pow(1 + r, n) - 1) / r);
}

export function calcDcaPmt(fv: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0 || n === 0) return 0;
  return (fv * r) / (Math.pow(1 + r, n) - 1);
}

export function calcMonthlyDividend(principal: number, yieldPct: number): number {
  return (principal * (yieldPct / 100)) / 12;
}

export function calcMonthlyDividendByDps(principal: number, price: number, annualDps: number): number {
  if (price <= 0) return 0;
  return (principal / price) * annualDps / 12;
}

export function calcRequiredPrincipal(monthlyTarget: number, yieldPct: number): number {
  if (yieldPct === 0) return 0;
  return (monthlyTarget * 12) / (yieldPct / 100);
}

export function formatWan(value: number): string {
  if (!isFinite(value) || isNaN(value) || value < 0) return "—";
  if (value >= 100_000_000) return (value / 100_000_000).toFixed(1) + " 億";
  if (value >= 10_000) return Math.round(value / 10_000) + " 萬";
  return Math.round(value).toLocaleString("zh-TW");
}

export function formatWanParts(value: number): { value: string; unit?: string } {
  if (!isFinite(value) || isNaN(value) || value < 0) return { value: "—" };
  if (value >= 100_000_000) return { value: (value / 100_000_000).toFixed(1), unit: "億" };
  if (value >= 10_000) return { value: String(Math.round(value / 10_000)), unit: "萬" };
  return { value: Math.round(value).toLocaleString("zh-TW") };
}

export function formatMoney(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "—";
  return Math.round(value).toLocaleString("zh-TW");
}
