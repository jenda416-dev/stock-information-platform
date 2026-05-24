import { NextResponse } from "next/server";
import sectorsData from "@/lib/sectors/sectors-tw.json";
import type { SectorsData, SectorApiResponse } from "@/types/sectors";

const SD_BASE = "https://statementdog.com";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  Referer: `${SD_BASE}/market-trend`,
};

type SdItem = { name: string; diff_percentage: number; url: string };

const cache = new Map<string, { data: SectorApiResponse; expiredAt: number }>();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") ?? "1day";
  const country = searchParams.get("country") ?? "tw";

  const cacheKey = `${country}/${period}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiredAt) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(`${SD_BASE}/api/v1/market-trend/${country}/${period}`, {
      headers: HEADERS,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`StatementDog: ${res.status}`);
    const json = await res.json();
    const sdItems: SdItem[] = json.data ?? [];

    const typed = sectorsData as unknown as SectorsData;
    const stocksById = new Map(typed.sectors.map((s) => [s.id, s.stocks]));

    const sectors = sdItems.map((item) => {
      const id = Number(item.url.split("/").pop());
      return {
        id,
        name: item.name,
        changePercent: item.diff_percentage,
        stocks: stocksById.get(id) ?? [],
      };
    });

    const data: SectorApiResponse = {
      sectors,
      period,
      country,
      fetchedAt: new Date().toISOString(),
    };

    cache.set(cacheKey, { data, expiredAt: Date.now() + 60_000 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      {
        sectors: [],
        period,
        country,
        fetchedAt: new Date().toISOString(),
        error: err instanceof Error ? err.message : "Failed to fetch",
      } satisfies SectorApiResponse,
      { status: 500 }
    );
  }
}
