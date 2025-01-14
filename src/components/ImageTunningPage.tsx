import { MyMessage } from "@/components/chat-bubbles/MyMessage";
import { TextMessageBox } from "@/components/chat-input-boxes/TextMessageBox";
import { TypingLoader } from "@/components/loaders/TypingLoader";
import { useRef, useState, useEffect } from "react";
import { FaMagic } from "react-icons/fa";
import { ImageGenerationUseCase } from "@/core/use-cases/image-generation.use-case";
import { ImageVariationUseCase } from "@/core/use-cases/image-variation.use-case";
import { IoIosCloseCircle } from "react-icons/io";
import { GptMessageWithSelectableImage } from "./chat-bubbles/GptMessageWithSelectableImage";
import { GptMessageWithImage } from "./chat-bubbles/GptMessageWithImage";

interface Message {
  text: string;
  isGpt: boolean;
  isErrorMessage?: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

const initialMessages: Message[] = [
  {
    text: "¡Bienvenido al apartado de edicion de imágenes!",
    isGpt: true,
  }
];

export const ImageTunningPage = () => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    originalImage: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async () => {
    setLoading(true);

    setOriginalImageAndMask({
      originalImage: undefined,
      mask: undefined,
    });

    const resp = await ImageVariationUseCase({
      originalImage: originalImageAndMask.originalImage!,
    });
    setLoading(false);

    if (resp.ok) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Imagen generada:",
          isGpt: true,
          isErrorMessage: false,
          info: {
            imageUrl: resp.imageUrl,
            alt: "Variación de la imagen",
          },
        },
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Image-GPT no pudo generar una imagen",
          isGpt: true,
          isErrorMessage: true,
        },
      ]);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handlePost = async (text: string) => {
    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);
    setLoading(true);

    const { mask, originalImage } = originalImageAndMask;

    const response = await ImageGenerationUseCase({
      description: text,
      originalImage,
      maskImage: mask,
    });
    setLoading(false);

    if (response.ok) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Imagen generada:",
          isGpt: true,
          info: {
            imageUrl: response.imageUrl,
            alt: "Imagen generada",
          },
        },
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Image-GPT no pudo generar una imagen",
          isGpt: true,
          isErrorMessage: true,
        },
      ]);
    }
  };

  return (
    <>
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2 scroll-y-active">
            {/* Renderizado de mensajes */}
            {messages.map((msg, index) =>
              msg.isGpt ? (
                !msg.info ? (
                  <GptMessageWithImage
                    key={index}
                    Icon={FaMagic}
                    isErrorMessage={msg.isErrorMessage}
                    text={msg.text}
                  />
                ) : (
                  <GptMessageWithSelectableImage
                    key={index}
                    Icon={FaMagic}
                    imageUrl={msg.info!.imageUrl}
                    onImageSelected={(maskImageUrl) =>
                      setOriginalImageAndMask({
                        originalImage: msg.info!.imageUrl,
                        mask: maskImageUrl,
                      })
                    }
                  />
                )
              ) : (
                <MyMessage key={index} text={msg.text} />
              )
            )}

            {loading && (
              <div className="col-start-1 col-end-12">
                <TypingLoader className="fade-up" />
              </div>
            )}

            {/* Elemento para referenciar el final del contenedor */}
            <div ref={messageEndRef}></div>
          </div>
        </div>

        <TextMessageBox
          onSendMessage={handlePost}
          placeholder="Escribe una descripción para generar una imagen"
          disableCorrections={true}
        />

        {originalImageAndMask.originalImage && (
          <div className="absolute top-4 right-4 flex flex-col w-4/12 bg-neutral-900 p-4 rounded-lg max-w-sm appears">
            <div className="">
              <img
                src={
                  !originalImageAndMask.mask
                    ? originalImageAndMask.originalImage
                    : originalImageAndMask.mask
                }
                alt="Imagen original"
                className="w-full rounded-lg"
              />
            </div>

            <div className="flex justify-between mt-2">
              <button
                onClick={handleVariation}
                className="mt-2 bg-neutral-100 text-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-400 transition-colors text-sm"
              >
                Generar Variacion
              </button>

              <button className="mt-2 ml-2 bg-neutral-100 text-neutral-900 px-2 py-1 rounded-lg hover:bg-neutral-400 transition-colors">
                <IoIosCloseCircle
                  className="size-7"
                  onClick={() =>
                    setOriginalImageAndMask({
                      originalImage: undefined,
                      mask: undefined,
                    })
                  }
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
