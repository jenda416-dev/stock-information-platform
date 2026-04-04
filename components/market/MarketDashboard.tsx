"use client";

import { useEffect, useState, useCallback } from "react";
import { IndexCard } from "./IndexCard";
import { IndexSkeleton } from "./IndexSkeleton";
import { FearGreedCard } from "./FearGreedCard";
import type { IndexData, FearGreedData, MarketApiResponse } from "@/types/market";

const REGIONS: Array<{ label: string; region: IndexData["region"]; count: number }> = [
  { label: "台股", region: "台股", count: 2 },
  { label: "美股", region: "美股", count: 6 },
];

export function MarketDashboard() {
  const [data, setData] = useState<IndexData[] | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/market");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: MarketApiResponse = await res.json();
      setData(json.data);
      setFearGreed(json.fearGreed);
      setFetchedAt(json.fetchedAt);
      setError(null);
    } catch {
      setError("無法載入市場資料，請稍後重試");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        {REGIONS.map((r) => (
          <section key={r.region}>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {r.label}
            </h2>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: r.count }).map((_, i) => (
                <IndexSkeleton key={i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{error}</p>
        <button
          onClick={() => fetchData(true)}
          className="mt-3 text-sm underline hover:text-foreground transition-colors"
        >
          重新載入
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">市場行情</h2>
        <div className="flex items-center gap-3">
          {fetchedAt && (
            <span className="text-xs text-muted-foreground">
              更新時間：{new Date(fetchedAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}
            </span>
          )}
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="text-sm px-3 py-1.5 rounded-md border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing ? "更新中..." : "更新報價"}
          </button>
        </div>
      </div>

      {REGIONS.map(({ label, region }) => {
        const indices = data?.filter((d) => d.region === region) ?? [];
        return (
          <section key={region}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {label}
            </h3>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {indices.map((index) => (
                <IndexCard key={index.symbol} index={index} />
              ))}
              {region === "美股" && fearGreed && (
                <FearGreedCard data={fearGreed} />
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
