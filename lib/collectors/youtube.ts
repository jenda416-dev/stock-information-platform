import { XMLParser } from "fast-xml-parser";
import { YoutubeTranscript } from "youtube-transcript";

export interface RssPost {
  guid: string;
  title: string;
  content: string | null;
  fullTranscript?: string | null;
  sourceUrl: string;
  platform: string;
  publishedAt: Date;
}

export async function fetchYoutubePosts(channelId: string): Promise<RssPost[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  const res = await fetch(feedUrl, {
    headers: { "User-Agent": "stock-dashboard/1.0" },
  });
  if (!res.ok) throw new Error(`YouTube RSS fetch failed: ${res.status}`);

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const parsed = parser.parse(xml);

  const entries: Record<string, unknown>[] = parsed?.feed?.entry ?? [];
  const list = Array.isArray(entries) ? entries : [entries];

  const posts: RssPost[] = [];

  for (const entry of list.slice(0, 3)) {
    const videoId = String((entry["yt:videoId"] as string) ?? "");
    if (!videoId) continue;

    const title = String(entry.title ?? "");
    const sourceUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const publishedAt = new Date(String(entry.published ?? ""));

    let fullTranscript: string | null = null;
    try {
      const segments = await YoutubeTranscript.fetchTranscript(videoId);
      fullTranscript = segments.map((s) => s.text).join(" ") || null;
    } catch {
      // No transcript available for this video
    }

    posts.push({
      guid: videoId,
      title,
      content: fullTranscript ? fullTranscript.slice(0, 500) : null,
      fullTranscript,
      sourceUrl,
      platform: "youtube",
      publishedAt,
    });
  }

  return posts;
}
