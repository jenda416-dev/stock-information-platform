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
    // First, check if the summary has a explicit tags section like `### 🏷️ 影片重點 Tags`
    // and extract tags starting with #
    const tagsSectionMatch = summary.match(/###\s*🏷️?\s*影片重點\s*Tags\n+([\s\S]*?)(?:\n---|$)/i) 
      || summary.match(/###\s*關鍵字.*\n+([\s\S]*?)(?:\n---|$)/i);
      
    if (tagsSectionMatch && tagsSectionMatch[1]) {
      const tagText = tagsSectionMatch[1];
      const tags = [...tagText.matchAll(/#([^\s#]+)/g)].map(m => m[1].trim()).filter(Boolean);
      if (tags.length > 0) {
        return tags;
      }
    }

    // Fallback to AI generation
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
- stocks 留空陣列代表無特定個股，有個股則用「公司名稱 代號」格式（台股例如「台積電 2330」、「聯電 2303」；美股例如「NVIDIA NVDA」；若不確定公司名稱則只填代號）
- adviceKeyword 判斷準則（只能選其中一個）：
  - 買進：影片中有明確建議進場或分批承接
  - 加碼：已持有，影片建議增加部位
  - 觀察：尚無進場時機，但值得持續追蹤
  - 減碼：影片建議降低部位或獲利了結
  - 避開：影片明確警告不要介入或風險過高
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
  } catch (err) {
    console.error("[generateSectionCards] 錯誤：", err);
    throw err;
  }
}

export async function summarizeVideoTranscript(
  transcript: string,
  title: string
): Promise<VideoSummaryResult | null> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

export async function generateGooayeMarkdownSummary(
  transcript: string,
  title: string
): Promise<{ summary: string; audioText: string } | null> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `請幫我將以下股癌（Gooaye）的節目內容整理成文字摘要，並「嚴格」依照我提供的 Markdown 格式輸出。
請直接給出排版好的結果，不需要任何額外的問候語或解釋：

---
videoId: [請擷取影片網址中的 YouTube ID，若無則填影片代號]
---

## [請給出一個吸睛的主標題，格式如：資金狂潮下的生存指南！XXX與XXX解析]

### 前言

[用 1-2 句話簡介本集的背景與核心看點]

### 📌 影片主旨

[用 1 小段話精煉總結本集探討的核心議題與主軸]

### 🔑 核心重點

- **[[時間戳記，如 10:49]] [重點標題]：** 深度解析：[針對該重點的詳細說明，寫成一段完整的段落，不需再往內縮排或列點]
- **[[時間戳記，如 15:15]] [重點標題]：** 深度解析：[針對該重點的詳細說明]
(請盡量將內容濃縮成 4-6 個重點)

### 🎯 潛在標的盤點

- **[標的名稱或板塊，如 聯電 2303 或 被動元件板塊]：** [主委對該標的/板塊的看法、邏輯與點評]
- **[標的名稱或板塊]：** [看法與邏輯]
(若本集完全沒有提及標的，請整段省略)

### 💡 關鍵金句 / 結論

> **「[請挑選本集主委最經典、最直白或最發人深省的一句原話]」**

**行動指南：** [總結投資人現階段該採取的具體心態或操作方針]

### 🏷️ 影片重點 Tags

#[Tag1] #[Tag2] #[Tag3] #[Tag4] #[Tag5]

---
以下是本次的節目內容：
標題：${title}
逐字稿：
${transcript.slice(0, 16000)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    if (!text) return null;

    // Extract the "影片主旨" section for TTS audio
    const audioTextMatch = text.match(/### 📌 影片主旨\n+([\s\S]+?)\n+###/);
    const audioText = audioTextMatch 
      ? audioTextMatch[1].trim() 
      : "本集影片重點已經整理完畢，請參考詳細文字摘要。";

    return {
      summary: text,
      audioText: audioText
    };
  } catch (error) {
    console.error("[generateGooayeMarkdownSummary] Error:", error);
    return null;
  }
}
