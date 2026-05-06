import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SectionCard } from "@/types/kol";

export interface VideoSummaryResult {
  summary: string;
  tags: string[];
}

export async function extractTagsFromSummary(
  summary: string,
  title: string
): Promise<string[]> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const result = await model.generateContent(
      `你是一位財經分析師。以下是 YouTube 影片「${title}」的文字摘要。

請從摘要中萃取 3 到 5 個標籤，回傳 JSON 陣列：
["標籤1", "標籤2", "標籤3"]

tags 規則：
- 股票代號用英文大寫（例如 NVDA、TSLA、2330）
- 主題、產業、總經概念用繁體中文（例如 AI、半導體、升息、Fed、台股、美股）
- 只回傳 JSON 陣列，不要加任何說明

摘要：\n\n${summary.slice(0, 2000)}`
    );

    const text = result.response.text().trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((t: unknown) => String(t).trim()).filter(Boolean).slice(0, 5);
  } catch {
    return [];
  }
}

export async function generateSectionCards(
  transcript: string,
  title: string
): Promise<SectionCard[]> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      `你是財經分析師，正在整理 YouTube 影片「${title}」的逐字稿。

請找出影片中所有明確提到投資觀點的段落，每個段落產出一張分析卡片。

回傳 JSON 陣列，格式：
[
  {
    "title": "主題標題（10字內）",
    "stocks": ["股票代號1", "股票代號2"],
    "logic": "為什麼關注這個機會或風險（1-2句）",
    "adviceKeyword": "買進|加碼|觀察|減碼|避開",
    "advice": "具體建議（1-2句）"
  }
]

規則：
- 3 到 7 張卡片，按重要性排序
- stocks 留空陣列代表無特定個股，有個股則用英文大寫代號（台股用四位數字，例如 2330）
- adviceKeyword 只能是「買進」「加碼」「觀察」「減碼」「避開」其中之一
- 只回傳 JSON 陣列，不要有其他說明

逐字稿：

${transcript.slice(0, 16000)}`
    );

    const text = result.response.text().trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (c: unknown) =>
          c &&
          typeof c === "object" &&
          typeof (c as Record<string, unknown>).title === "string" &&
          Array.isArray((c as Record<string, unknown>).stocks) &&
          typeof (c as Record<string, unknown>).logic === "string" &&
          typeof (c as Record<string, unknown>).adviceKeyword === "string" &&
          typeof (c as Record<string, unknown>).advice === "string"
      )
      .slice(0, 7) as SectionCard[];
  } catch {
    return [];
  }
}

export async function summarizeVideoTranscript(
  transcript: string,
  title: string
): Promise<VideoSummaryResult | null> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const result = await model.generateContent(
      `你是一位財經分析師。以下是 YouTube 影片「${title}」的逐字稿內容。

請回傳一個 JSON 物件，格式如下：
{
  "summary": "用繁體中文整理出 3-5 句重點摘要",
  "tags": ["標籤1", "標籤2", "標籤3"]
}

tags 規則：
- 3 到 5 個標籤
- 股票代號用英文大寫（例如 NVDA、TSLA、2330）
- 主題、產業、總經概念用繁體中文（例如 AI、半導體、升息、Fed、台股、美股）
- 只回傳 JSON，不要加任何說明

逐字稿：\n\n${transcript.slice(0, 8000)}`
    );

    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.summary || !Array.isArray(parsed.tags)) return null;

    return {
      summary: String(parsed.summary).trim(),
      tags: parsed.tags.map((t: unknown) => String(t).trim()).filter(Boolean).slice(0, 5),
    };
  } catch {
    return null;
  }
}
