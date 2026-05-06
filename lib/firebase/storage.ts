import { adminStorage } from "./admin";

export async function uploadAudioToStorage(
  buffer: Buffer,
  guid: string
): Promise<string> {
  const file = adminStorage.file(`kol-audio/${guid}.mp3`);

  await file.save(buffer, {
    metadata: { contentType: "audio/mpeg" },
  });

  await file.makePublic();

  return file.publicUrl();
}
