import { backendWebApiUrl } from "@/config/config";

interface ProsConsDiscusserUseCase {
  prompt: string;
  abortSignal?: AbortSignal;
}

export async function* prosConsStreamDiscusserUseCase({
  prompt,
  abortSignal,
}: ProsConsDiscusserUseCase) {
  try {
    const resp = await fetch(`${backendWebApiUrl}/pros-cons-discusser-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),

      signal: abortSignal,
    });

    if (!resp.ok) {
      throw new Error("No se pudo obtener una respuesta del servidor");
    }

    const reader = resp.body?.getReader();

    if (!reader) {
      return null;
    }

    const decoder = new TextDecoder("utf-8");
    let message = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const decodedChunk = decoder.decode(value, { stream: true });

      message += decodedChunk;
      yield message;
    }
  } catch (error) {
    throw new Error("No se pudo obtener una respuesta del servidor");
  }
}
