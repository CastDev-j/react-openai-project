import { backendAssistantApiUrl } from "@/config/config";
import type { QuestionResponse } from "@/interfaces/assistant.response";

export const getMessagesByThreadUseCase = async (threadId: string) => {
  try {
    const response = await fetch(`${backendAssistantApiUrl}/get-message-list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId,
      }),
    });    

    const { messages } = await response.json() as QuestionResponse;

    return messages;
  } catch (error) {
    throw new Error("Error al obtener los mensajes");
  }
};
