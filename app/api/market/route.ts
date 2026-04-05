import { NextResponse } from "next/server";
import type { IndexData, FearGreedData, MarketApiResponse } from "@/types/market";

const SYMBOLS: Array<{ symbol: string; name: string; region: IndexData["region"] }> = [
  { symbol: "^TWII",  name: "加權指數",     region: "台股" },
  { symbol: "^TWOII", name: "櫃買指數",     region: "台股" },
  { symbol: "^DJI",   name: "道瓊",         region: "美股" },
  { symbol: "^IXIC",  name: "納斯達克",     region: "美股" },
  { symbol: "^GSPC",  name: "S&P 500",      region: "美股" },
  { symbol: "^SOX",   name: "費城半導體",   region: "美股" },
  { symbol: "^VIX",   name: "VIX 恐慌指數", region: "美股" },
  { symbol: "BTC-USD", name: "比特幣 BTC",  region: "虛擬貨幣" },
  { symbol: "ETH-USD", name: "以太幣 ETH",  region: "虛擬貨幣" },
];

let cache: { data: MarketApiResponse; expiredAt: number } | null = null;

async function fetchSymbol(
  entry: (typeof SYMBOLS)[0]
): Promise<IndexData> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(entry.symbol)}?interval=1d&range=1d`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) throw new Error("No meta in response");
    const price: number = meta.regularMarketPrice ?? 0;
    const prevClose: number = meta.previousClose ?? meta.chartPreviousClose ?? price;
    const change: number = meta.regularMarketChange ?? price - prevClose;
    const changePercent: number =
      meta.regularMarketChangePercent ?? (prevClose ? (change / prevClose) * 100 : 0);
    return {
      ...entry,
      price,
      change,
      changePercent,
      currency: meta.currency ?? "USD",
      updatedAt: meta.regularMarketTime ?? Math.floor(Date.now() / 1000),
    };
  } catch (err) {
    return {
      ...entry,
      price: 0,
      change: 0,
      changePercent: 0,
      currency: "USD",
      updatedAt: Math.floor(Date.now() / 1000),
      error: err instanceof Error ? err.message : "未知錯誤",
    };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFearGreed(): Promise<FearGreedData | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(
      "https://production.dataviz.cnn.io/index/fearandgreed/graphdata",
      {
        signal: controller.signal,
        cache: "no-store",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": "https://www.cnn.com/markets/fear-and-greed",
          "Origin": "https://www.cnn.com",
        },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const fg = json?.fear_and_greed;
    if (!fg) throw new Error("No fear_and_greed in response");
    return {
      score: Math.round(fg.score),
      rating: fg.rating ?? "neutral",
      previousClose: fg.previous_close ?? fg.score,
      updatedAt: fg.timestamp ?? new Date().toISOString(),
    };
  } catch (err) {
    return {
      score: 0,
      rating: "neutral",
      previousClose: 0,
      updatedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : "未知錯誤",
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  if (cache && Date.now() < cache.expiredAt) {
    return NextResponse.json(cache.data);
  }

  const [data, fearGreed] = await Promise.all([
    Promise.all(SYMBOLS.map(fetchSymbol)),
    fetchFearGreed(),
  ]);

  const response: MarketApiResponse = {
    data,
    fearGreed,
    fetchedAt: new Date().toISOString(),
  };

  cache = { data: response, expiredAt: Date.now() + 30_000 };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store, no-cache" },
  });
}
