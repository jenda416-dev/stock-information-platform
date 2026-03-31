import { XMLParser } from "fast-xml-parser";

export interface NewsArticle {
  sourceName: string;
  title: string;
  description: string | null;
  url: string;
  publishedAt: Date;
}

export async function fetchAllNews(): Promise<NewsArticle[]> {
  const feedUrl =
    "https://news.google.com/rss/search?q=%E8%82%A1%E5%B8%82+%E8%B2%A1%E7%B6%93&hl=zh-TW&gl=TW&ceid=TW:zh-Hant";

  const res = await fetch(feedUrl, {
    headers: { "User-Agent": "stock-dashboard/1.0" },
  });
  if (!res.ok) return [];

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);
  const items: Record<string, unknown>[] = parsed?.rss?.channel?.item ?? [];
  const list = Array.isArray(items) ? items : [items];

  return list.map((item) => ({
    sourceName: "GoogleNews",
    title: String(item.title ?? ""),
    description: String(item.description ?? ""),
    url: String(item.link ?? ""),
    publishedAt: new Date(String(item.pubDate)),
  }));
}
