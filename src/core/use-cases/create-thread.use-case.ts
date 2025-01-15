import { backendAssistantApiUrl } from "@/config/config";

export const createThreadUseCase = async () => {
  try {
    const response = await fetch(`${backendAssistantApiUrl}/create-thread`, {
      method: "POST",
    });

    const { id } = await response.json();

    return id;
  } catch (error) {
    throw new Error("Error al crear el hilo de mensajes");
  }
};
