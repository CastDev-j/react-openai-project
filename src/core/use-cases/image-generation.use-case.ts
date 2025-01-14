import { backendWebApiUrl } from "@/config/config";

interface ImageGenerationUseCase {
  description: string;
  originalImage?: string;
  maskImage?: string;
}

interface ImageGenerationUseCaseResponse {
  ok: boolean;
  message: string;
  imageUrl: string;
}

export const ImageGenerationUseCase = async ({
  description,
  originalImage,
  maskImage,
}: ImageGenerationUseCase): Promise<ImageGenerationUseCaseResponse> => {

  try {
    const response = await fetch(`${backendWebApiUrl}/image-generation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: description,
        originalImage,
        maskImage,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        message: "",
        imageUrl: "",
      };
    }

    const { url, revised_prompt: alt } = await response.json();

    return {
      ok: true,
      message: alt,
      imageUrl: url,
    };
  } catch (error) {
    return {
      ok: false,
      message: "",
      imageUrl: "",
    };
  }
};
