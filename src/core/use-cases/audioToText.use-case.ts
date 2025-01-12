import { backendWebApiUrl } from "@/config/config";

interface AudioToTextUseCase {
  prompt: string;
  audio: File;
}

export const audioToTextUseCase = async ({
  prompt,
  audio,
}: AudioToTextUseCase) => {
  try {

    const formData = new FormData();

    formData.append("prompt", prompt);
    formData.append("audio", audio);


    const response = await fetch(`${backendWebApiUrl}/audio-to-text`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: "No se pudo generar el texto",
      };
    }
    
    return {
      ok: true,
      text: data.text,
    };

  } catch (error) {
    return {
      ok: false,
      message: "No se pudo generar el texto",
    };
  }
};
