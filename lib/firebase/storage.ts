import { put } from "@vercel/blob";

export async function uploadAudioToStorage(
  buffer: Buffer,
  guid: string
): Promise<string> {
  const { url } = await put(`kol-audio/${guid}.mp3`, buffer, {
    access: "public",
    contentType: "audio/mpeg",
  });

  return url;
}
