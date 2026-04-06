export interface EarningsCallEvent {
  stockCode: string;
  stockName: string;
  callDate: string; // "YYYY-MM-DD"
  callTime: string | null;
  location: string | null;
  officialUrl: string | null;
  pdfUrl: string | null;
}

function rocToIso(rocDate: string): string {
  // "114/03/25" → "2025-03-25"
  const parts = rocDate.trim().split("/");
  if (parts.length !== 3) return "";
  const [year, month, day] = parts;
  return `${parseInt(year) + 1911}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function extractCells(row: string): string[] {
  const cells: string[] = [];
  const regex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let match;
  while ((match = regex.exec(row)) !== null) {
    cells.push(match[1].trim());
  }
  return cells;
}

async function fetchMopsMonth(
  typek: "sii" | "otc",
  rocYear: number,
  month: number
): Promise<EarningsCallEvent[]> {
  const body = new URLSearchParams({
    encodeURIComponent: "1",
    step: "1",
    firstin: "1",
    off: "1",
    TYPEK: typek,
    year: String(rocYear),
    month: String(month),
  });

  const res = await fetch(
    "https://mops.twse.com.tw/mops/web/ajax_t100sb03",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "stock-dashboard/1.0",
      },
      body: body.toString(),
    }
  );

  if (!res.ok) throw new Error(`MOPS fetch failed: ${res.status}`);

  const html = await res.text();
  const events: EarningsCallEvent[] = [];

  // Extract all <tr> rows
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const cells = extractCells(rowMatch[1]);
    if (cells.length < 5) continue;

    const stockCode = stripHtml(cells[0]);
    const stockName = stripHtml(cells[1]);

    // Stock codes are 4-digit numbers
    if (!/^\d{4,6}$/.test(stockCode)) continue;

    const rawDate = stripHtml(cells[2]);
    const callDate = rocToIso(rawDate);
    if (!callDate) continue;

    const callTime = stripHtml(cells[3]) || null;
    const location = stripHtml(cells[4]) || null;

    // Extract PDF URL if present
    let pdfUrl: string | null = null;
    const pdfMatch = cells[5] ? cells[5].match(/href="([^"]+\.pdf[^"]*)"/) : null;
    if (pdfMatch) {
      pdfUrl = pdfMatch[1].startsWith("http")
        ? pdfMatch[1]
        : `https://mops.twse.com.tw${pdfMatch[1]}`;
    }

    const officialUrl = `https://mops.twse.com.tw/mops/web/t100sb03`;

    events.push({ stockCode, stockName, callDate, callTime, location, officialUrl, pdfUrl });
  }

  return events;
}

export async function fetchEarningsCallSchedule(
  stockCodes: string[]
): Promise<EarningsCallEvent[]> {
  if (stockCodes.length === 0) return [];

  const now = new Date();
  const ceYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const rocYear = ceYear - 1911;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextRocYear = currentMonth === 12 ? rocYear + 1 : rocYear;

  const [currentResults, nextResults] = await Promise.allSettled([
    fetchMopsMonth("sii", rocYear, currentMonth),
    fetchMopsMonth("sii", nextRocYear, nextMonth),
  ]);

  const all: EarningsCallEvent[] = [];
  if (currentResults.status === "fulfilled") all.push(...currentResults.value);
  if (nextResults.status === "fulfilled") all.push(...nextResults.value);

  // Filter to only watched stocks
  const codeSet = new Set(stockCodes);
  return all.filter((e) => codeSet.has(e.stockCode));
}
