import { config } from 'dotenv';
config({ path: '.env.local' });

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

async function main() {
  // 測 Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const r = await model.generateContent('回傳 JSON: [{"test":true}]').catch(e => ({ error: e.message }));
  if ('error' in r) console.log('❌ Gemini:', r.error);
  else console.log('✅ Gemini OK:', r.response.text().slice(0, 80));

  // 測 OpenAI TTS
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const tts = await openai.audio.speech.create({ model: 'tts-1', voice: 'nova', input: '測試', response_format: 'mp3' }).catch(e => ({ error: e.message }));
  if ('error' in tts) console.log('❌ OpenAI TTS:', tts.error);
  else console.log('✅ OpenAI TTS OK, bytes:', (await tts.arrayBuffer()).byteLength);
}

main().catch(console.error);
