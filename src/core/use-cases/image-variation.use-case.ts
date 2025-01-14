import { backendWebApiUrl } from "@/config/config";

interface ImageVariationUseCase {
  originalImage: string;
}

interface ImageVariationUseCaseResponse {
  ok: boolean;
  message: string;
  imageUrl: string;
}

export const ImageVariationUseCase = async ({
  originalImage,
}: ImageVariationUseCase): Promise<ImageVariationUseCaseResponse> => {
  try {
    const response = await fetch(`${backendWebApiUrl}/image-variation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        baseImage: originalImage,
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
