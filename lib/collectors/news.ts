import { XMLParser } from "fast-xml-parser";

export interface NewsArticle {
  sourceName: string;
  title: string;
  description: string | null;
  url: string;
  publishedAt: Date;
}

// NewsAPI.org
async function fetchFromNewsApi(today: string): Promise<NewsArticle[]> {
  const key = process.env.NEWS_API_KEY;
  if (!key) return [];

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", "stock OR market OR economy OR Fed OR 台股 OR 財經");
  url.searchParams.set("language", "zh");
  url.searchParams.set("from", today);
  url.searchParams.set("pageSize", "100");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("apiKey", key);

  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();

  return (data.articles ?? []).map((a: Record<string, string>) => ({
    sourceName: "NewsAPI",
    title: a.title ?? "",
    description: a.description ?? null,
    url: a.url,
    publishedAt: new Date(a.publishedAt),
  }));
}

// GNews.io
async function fetchFromGNews(): Promise<NewsArticle[]> {
  const key = process.env.GNEWS_API_KEY;
  if (!key) return [];

  const url = new URL("https://gnews.io/api/v4/search");
  url.searchParams.set("q", "股票 財經 市場");
  url.searchParams.set("lang", "zh");
  url.searchParams.set("max", "50");
  url.searchParams.set("apikey", key);

  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();

  return (data.articles ?? []).map((a: Record<string, string>) => ({
    sourceName: "GNews",
    title: a.title ?? "",
    description: a.description ?? null,
    url: a.url,
    publishedAt: new Date(a.publishedAt),
  }));
}

// Google News RSS (no API key needed)
async function fetchFromGoogleNewsRss(): Promise<NewsArticle[]> {
  const feedUrl =
    "https://news.google.com/rss/search?q=%E8%82%A1%E5%B8%82+%E8%B2%A1%E7%B6%93&hl=zh-TW&gl=TW&ceid=TW:zh-Hant";

  const res = await fetch(feedUrl, {
    headers: { "User-Agent": "stock-dashboard/1.0" },
  });
  if (!res.ok) return [];

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);
  const items: Record<string, unknown>[] =
    parsed?.rss?.channel?.item ?? [];
  const list = Array.isArray(items) ? items : [items];

  return list.map((item) => ({
    sourceName: "GoogleNews",
    title: String(item.title ?? ""),
    description: String(item.description ?? ""),
    url: String(item.link ?? ""),
    publishedAt: new Date(String(item.pubDate)),
  }));
}

export async function fetchAllNews(today: string): Promise<NewsArticle[]> {
  const [newsApi, gnews, googleRss] = await Promise.allSettled([
    fetchFromNewsApi(today),
    fetchFromGNews(),
    fetchFromGoogleNewsRss(),
  ]);

  const all: NewsArticle[] = [
    ...(newsApi.status === "fulfilled" ? newsApi.value : []),
    ...(gnews.status === "fulfilled" ? gnews.value : []),
    ...(googleRss.status === "fulfilled" ? googleRss.value : []),
  ];

  // deduplicate by URL
  const seen = new Set<string>();
  return all.filter((a) => {
    if (!a.url || seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
}
