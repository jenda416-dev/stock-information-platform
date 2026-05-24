/**
 * One-time script: fetch Taiwan stock sector data from StatementDog
 * Run: npx tsx scripts/fetch-sectors.ts
 * Output: lib/sectors/sectors-tw.json
 *
 * Strategy:
 * 1. Call market-trend API across multiple time periods → collect all unique sectors
 * 2. For each sector, fetch the tag page HTML → extract constituent stock codes & names
 * 3. Save as static JSON (run again to refresh)
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import type { SectorsData, Sector } from "../types/sectors";

const BASE = "https://statementdog.com";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: `${BASE}/market-trend`,
};

const TIME_PERIODS = ["1day", "1week", "1month", "3months", "ytd", "1year"];

type MarketTrendItem = {
  name: string;
  diff_percentage: number;
  url: string;
};

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchAllSectorIds(): Promise<Map<string, { id: string; name: string }>> {
  const sectors = new Map<string, { id: string; name: string }>();

  for (const period of TIME_PERIODS) {
    const url = `${BASE}/api/v1/market-trend/tw/${period}`;
    console.log(`  Fetching ${period}...`);

    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { data: MarketTrendItem[] };

      for (const item of json.data ?? []) {
        const id = item.url.split("/").pop();
        if (id && !sectors.has(id)) {
          sectors.set(id, { id, name: item.name });
        }
      }
    } catch (err) {
      console.warn(`  Failed for period ${period}:`, err);
    }

    await sleep(400);
  }

  return sectors;
}

function extractStocksFromHtml(html: string) {
  // Pattern: "台股 {code}" followed by stock name in next div
  const pattern = /台股\s+(\d{4,5})\s*<\/div>\s*<div[^>]*>\s*([^<*\n]{2,12})\*?/g;
  const seen = new Set<string>();
  const stocks: { stockId: string; stockName: string }[] = [];

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    const stockId = match[1];
    const stockName = match[2].trim().replace(/\*$/, "").trim();
    if (!seen.has(stockId) && stockName.length >= 2 && stockName.length <= 10) {
      seen.add(stockId);
      stocks.push({ stockId, stockName });
    }
  }

  return stocks;
}

function extractDescriptionFromHtml(html: string): string {
  const match =
    html.match(/<meta\s+name="description"\s+content="([^"]+)"/i) ??
    html.match(/<meta\s+content="([^"]+)"\s+name="description"/i);
  return match?.[1]?.trim() ?? "";
}

async function fetchSectorStocks(tagId: string, name: string, retries = 3): Promise<{ stocks: { stockId: string; stockName: string }[]; description: string }> {
  const url = `${BASE}/tags/${tagId}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (res.status === 429) {
        const wait = attempt * 3000;
        console.warn(`  [${tagId}] rate limited, waiting ${wait / 1000}s...`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const stocks = extractStocksFromHtml(html);
      const description = extractDescriptionFromHtml(html);
      console.log(`  [${tagId}] ${name}: ${stocks.length} stocks`);
      return { stocks, description };
    } catch (err) {
      if (attempt === retries) {
        console.warn(`  [${tagId}] ${name}: failed after ${retries} attempts (${err})`);
        return { stocks: [], description: "" };
      }
    }
  }
  return { stocks: [], description: "" };
}

async function main() {
  console.log("Step 1: Collecting sector IDs from market-trend API...");
  const sectorIds = await fetchAllSectorIds();
  console.log(`Found ${sectorIds.size} unique sectors across all time periods\n`);

  console.log("Step 2: Fetching constituent stocks for each sector...");
  const sectors: Sector[] = [];

  const entries = Array.from(sectorIds.values());
  for (let i = 0; i < entries.length; i++) {
    const { id, name } = entries[i];
    const { stocks, description } = await fetchSectorStocks(id, name);

    if (stocks.length > 0) {
      sectors.push({ id: Number(id), name, ...(description && { description }), stocks });
    }

    // Polite delay + progress
    if ((i + 1) % 10 === 0) {
      console.log(`  Progress: ${i + 1}/${entries.length}`);
    }
    await sleep(1500);
  }

  // Sort by sector name
  sectors.sort((a, b) => a.name.localeCompare(b.name, "zh-TW"));

  const output: SectorsData = {
    updatedAt: new Date().toISOString(),
    sectors,
  };

  const outDir = join(process.cwd(), "lib", "sectors");
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, "sectors-tw.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`\nDone! Written to ${outPath}`);
  console.log(`Total sectors with stocks: ${sectors.length}`);
  console.log(`Total unique stocks: ${new Set(sectors.flatMap(s => s.stocks.map(st => st.stockId))).size}`);

  console.log("\nSample sectors:");
  sectors.slice(0, 10).forEach((s) => {
    console.log(`  ${s.name}: ${s.stocks.map(st => `${st.stockId} ${st.stockName}`).join(", ")}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
