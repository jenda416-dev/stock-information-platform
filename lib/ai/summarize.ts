import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import type { NewsArticle } from "@/lib/collectors/news";

export interface BulletPoint {
  point: string;
  sources: Array<{ title: string; url: string }>;
}

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    bullet_points: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          point: { type: SchemaType.STRING },
          sources: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                url: { type: SchemaType.STRING },
              },
              required: ["title", "url"],
            },
            minItems: 1,
            maxItems: 3,
          },
        },
        required: ["point", "sources"],
      },
      minItems: 10,
      maxItems: 10,
    },
  },
  required: ["bullet_points"],
};

export async function summarizeNews(
  articles: NewsArticle[],
  dateStr: string
): Promise<BulletPoint[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  // Take top 20 articles, truncate descriptions
  const selected = articles.slice(0, 20).map((a) => ({
    title: a.title,
    description: (a.description ?? "").slice(0, 150),
    url: a.url,
    source: a.sourceName,
  }));

  const articleList = selected
    .map((a, i) => `${i + 1}. 標題: ${a.title}\n   描述: ${a.description}\n   來源: ${a.source}\n   URL: ${a.url}`)
    .join("\n\n");

  const prompt = `你是一位專業的財經分析師。請閱讀以下 ${dateStr} 的財經新聞，整理出今日最重要的10個財經重點。

每個重點必須：
1. 使用繁體中文
2. 清晰、簡潔（1-2句話）
3. 包含具體數字或事件名稱
4. 附上支持該重點的原文來源（1-3個）

以下是今日的財經新聞列表：

${articleList}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text);
  return parsed.bullet_points as BulletPoint[];
}
