import { NextResponse } from "next/server";
import type { IndexData, FearGreedData, MarketApiResponse } from "@/types/market";

const SYMBOLS: Array<{ symbol: string; name: string; region: IndexData["region"] }> = [
  { symbol: "^TWII",  name: "加權指數",     region: "台股" },
  // ^TWOII 已改用 TPEx 官方 API（fetchTaiwanOTC），Yahoo Finance 資料不可靠
  { symbol: "^DJI",   name: "道瓊",         region: "美股" },
  { symbol: "^IXIC",  name: "納斯達克",     region: "美股" },
  { symbol: "^GSPC",  name: "S&P 500",      region: "美股" },
  { symbol: "^SOX",   name: "費城半導體",   region: "美股" },
  { symbol: "^VIX",   name: "VIX 恐慌指數", region: "美股" },
  { symbol: "BTC-USD", name: "比特幣 BTC",  region: "虛擬貨幣" },
  { symbol: "ETH-USD", name: "以太幣 ETH",  region: "虛擬貨幣" },
];

let cache: { data: MarketApiResponse; expiredAt: number } | null = null;

async function fetchIntraday(symbol: string): Promise<number[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=5m&range=1d`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const closes: (number | null)[] =
      json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
    return closes.filter((c): c is number => c != null && !isNaN(c));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function fetchSymbol(
  entry: (typeof SYMBOLS)[0]
): Promise<IndexData> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(entry.symbol)}?interval=1d&range=7d`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const [res, intradayCloses] = await Promise.all([
      fetch(url, {
        signal: controller.signal,
        cache: "no-store",
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json",
        },
      }),
      fetchIntraday(entry.symbol),
    ]);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) throw new Error("No meta in response");
    const price: number = meta.regularMarketPrice ?? 0;

    // 計算本日漲跌：用 closes 陣列的倒數第二筆當 prevClose
    // Yahoo Finance 的 meta.regularMarketChange 有時以 chart 起始點為基準，數值不可靠
    const closes: (number | null)[] = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
    const validCloses = closes.filter((c): c is number => c != null && !isNaN(c));
    const prevClose: number =
      validCloses.length >= 2
        ? validCloses[validCloses.length - 2]
        : (meta.previousClose ?? meta.chartPreviousClose ?? price);
    const change: number = price - prevClose;
    const changePercent: number = prevClose ? (change / prevClose) * 100 : 0;

    // 計算本週漲跌幅（以本週第一個交易日收盤為基準）
    const timestamps: number[] = json?.chart?.result?.[0]?.timestamp ?? [];
    let weekChange: number | undefined;
    let weekChangePercent: number | undefined;
    let weekStartDate: string | undefined;

    // 計算本週一 00:00 UTC（無論今天是週幾都能正確推算）
    const now = new Date();
    const utcDay = now.getUTCDay(); // 0=Sun,1=Mon,...,6=Sat
    const daysToMonday = utcDay === 0 ? 6 : utcDay - 1;
    const thisMondayMs = Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysToMonday
    );

    // 本週第一個有效交易日（timestamp >= 本週一，且 close 非 null）
    const thisWeekIdx = timestamps.findIndex(
      (ts, i) => ts * 1000 >= thisMondayMs && closes[i] != null && !isNaN(closes[i] as number)
    );

    if (thisWeekIdx >= 0) {
      const weekStart = closes[thisWeekIdx] as number;
      weekChange = price - weekStart;
      weekChangePercent = weekStart !== 0 ? (weekChange / weekStart) * 100 : 0;
      weekStartDate = new Date(timestamps[thisWeekIdx] * 1000).toLocaleDateString("zh-TW", {
        month: "numeric",
        day: "numeric",
        timeZone: "Asia/Taipei",
      });
    }

    const dailyCloses = closes.filter((c): c is number => c != null && !isNaN(c));
    const sparkline = intradayCloses.length >= 5 ? intradayCloses : dailyCloses.slice(-7);

    return {
      ...entry,
      price,
      change,
      changePercent,
      weekChange,
      weekChangePercent,
      weekStartDate,
      sparkline,
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

async function fetchTaiwanOTC(): Promise<IndexData> {
  const url = "https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_index/st41_result.php?l=zh-tw&o=json";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  const fallback: IndexData = {
    symbol: "^TWOII", name: "櫃買指數", region: "台股",
    price: 0, change: 0, changePercent: 0, currency: "TWD",
    updatedAt: Math.floor(Date.now() / 1000), error: "資料暫時無法取得",
  };
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // rows: [日期(民國), 成交張數, 金額(仟元), 筆數, 櫃買指數, 漲/跌]
    const rows: [string, string, string, string, number, number][] =
      json?.tables?.[0]?.data ?? [];
    if (rows.length === 0) throw new Error("No data");

    const latest = rows[rows.length - 1];
    const price = latest[4];
    const change = latest[5];
    const prevPrice = price - change;
    const changePercent = prevPrice ? (change / prevPrice) * 100 : 0;
    const sparkline = rows.map((r) => r[4]);

    // 本週漲跌幅
    const now = new Date();
    const utcDay = now.getUTCDay();
    const daysToMonday = utcDay === 0 ? 6 : utcDay - 1;
    const thisMondayMs = Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysToMonday
    );
    const parseTPExDate = (d: string): number => {
      const [roc, m, day] = d.split("/");
      return Date.UTC(parseInt(roc) + 1911, parseInt(m) - 1, parseInt(day));
    };
    const thisWeekRows = rows.filter((r) => parseTPExDate(r[0]) >= thisMondayMs);
    let weekChange: number | undefined;
    let weekChangePercent: number | undefined;
    let weekStartDate: string | undefined;
    if (thisWeekRows.length > 0) {
      const weekStartPrice = thisWeekRows[0][4];
      weekChange = price - weekStartPrice;
      weekChangePercent = weekStartPrice ? (weekChange / weekStartPrice) * 100 : 0;
      const d = parseTPExDate(thisWeekRows[0][0]);
      weekStartDate = new Date(d).toLocaleDateString("zh-TW", {
        month: "numeric", day: "numeric", timeZone: "UTC",
      });
    }

    return {
      symbol: "^TWOII", name: "櫃買指數", region: "台股",
      price, change, changePercent,
      weekChange, weekChangePercent, weekStartDate,
      sparkline, currency: "TWD",
      updatedAt: Math.floor(Date.now() / 1000),
    };
  } catch (err) {
    return { ...fallback, error: err instanceof Error ? err.message : "未知錯誤" };
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

  const [yahooData, taiwanOTC, fearGreed] = await Promise.all([
    Promise.all(SYMBOLS.map(fetchSymbol)),
    fetchTaiwanOTC(),
    fetchFearGreed(),
  ]);

  // 把櫃買指數插在加權指數（index 0）之後
  const data: IndexData[] = [yahooData[0], taiwanOTC, ...yahooData.slice(1)];

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
