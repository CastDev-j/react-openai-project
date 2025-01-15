import { backendAssistantApiUrl } from "@/config/config";
import type { QuestionResponse } from "@/interfaces/assistant.response";

export const askQuestionUseCase = async (
  threadId: string,
  question: string
) => {
  try {

    const response = await fetch(`${backendAssistantApiUrl}/user-question`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId,
        question,
      }),
    });

    const {messages} = await response.json() as QuestionResponse;

    return {
      ok: true,
      message: '',
      replies: messages,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Error al enviar la pregunta",
    };
  }
};
