import { GoogleGenerativeAI } from "@google/generative-ai";

export async function summarizeVideoTranscript(
  transcript: string,
  title: string
): Promise<string | null> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      `你是一位財經分析師。以下是 YouTube 影片「${title}」的逐字稿內容。請用繁體中文整理出 3-5 句重點摘要，只回傳摘要內容，不要加任何說明或標題：\n\n${transcript.slice(0, 8000)}`
    );
    return result.response.text().trim() || null;
  } catch {
    return null;
  }
}
