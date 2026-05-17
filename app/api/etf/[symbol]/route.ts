import { NextResponse } from "next/server";

const HISTORICAL_RETURNS: Record<string, number> = {
  "0050": 14.4,
  "0056": 9.2,
  "00878": 10.1,
  "00918": 11.9,
  "00919": 11.5,
};

type TwseEntry = {
  Code: string;
  Name: string;
  DividendYield: string;
  PEratio: string;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const code = symbol.toUpperCase().trim();

  try {
    const res = await fetch(
      "https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_d",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("TWSE API error");

    const data: TwseEntry[] = await res.json();
    const entry = data.find((d) => d.Code === code);

    if (!entry) {
      return NextResponse.json({ error: "找不到此代碼" }, { status: 404 });
    }

    const dividendYield = parseFloat(entry.DividendYield);

    return NextResponse.json({
      code,
      name: entry.Name,
      dividendYield: isNaN(dividendYield) ? null : dividendYield,
      historicalReturn: HISTORICAL_RETURNS[code] ?? null,
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "資料取得失敗，請稍後再試" }, { status: 500 });
  }
}
