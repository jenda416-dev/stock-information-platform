import OpenAI from "openai";

export async function generateAudioFromText(
  text: string
): Promise<Buffer | null> {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text.slice(0, 4096),
      response_format: "mp3",
    });

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}
