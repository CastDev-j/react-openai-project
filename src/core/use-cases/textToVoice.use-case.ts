import { backendWebApiUrl } from "@/config/config";

interface TextToAudioUseCase {
  prompt: string;
  voice: string;
}

export const textToAudioUseCase = async ({
  prompt,
  voice,
}: TextToAudioUseCase) => {
  try {
    const resp = await fetch(`${backendWebApiUrl}/text-to-audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, voice }),
    });

    if (!resp.ok) {
      return {
        ok: false,
        message: "No se pudo generar el audio",
      };
    }

    const audioFile = await resp.blob();
    const audioUrl = URL.createObjectURL(audioFile);

    return {
      ok: true,
      message: prompt,
      audioUrl,
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo generar el audio",
    };
  }
};
