import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NewsArticle } from "@/lib/collectors/news";
import type { BulletPoint } from "@/types/news";

export async function summarizeNews(articles: NewsArticle[]): Promise<BulletPoint[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const articleList = articles
    .slice(0, 30)
    .map((a, i) => `${i + 1}. ${a.title}（${a.sourceName}）\n   URL: ${a.url}`)
    .join("\n\n");

  const prompt = `你是一位專業的財經分析師。請閱讀以下財經新聞標題，整理出今日最重要的 8 個財經重點。

請以 JSON 格式回傳，格式如下（只回傳 JSON，不要有其他文字）：
[
  {
    "title": "簡短標題（10字以內）",
    "point": "詳細說明（1-2句，包含具體數字或事件）",
    "sources": [{ "title": "來源名稱", "url": "來源網址" }]
  }
]

規則：
- 全程使用繁體中文
- 每個重點附上 1-2 個來源（從以下新聞中選）
- sources 的 url 必須來自以下列表

新聞列表：
${articleList}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Extract JSON array from response
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("AI response did not contain a JSON array");

  const parsed = JSON.parse(match[0]);
  return parsed as BulletPoint[];
}
