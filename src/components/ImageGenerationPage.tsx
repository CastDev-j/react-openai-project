import { MyMessage } from "@/components/chat-bubbles/MyMessage";
import { TextMessageBox } from "@/components/chat-input-boxes/TextMessageBox";
import { TypingLoader } from "@/components/loaders/TypingLoader";
import { useRef, useState, useEffect } from "react";
import { FaImage } from "react-icons/fa";
import { ImageGenerationUseCase } from "@/core/use-cases/image-generation.use-case";
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
    text: "¡Bienvenido al apartado de generación de imágenes!",
    isGpt: true,
  },
];

export const ImageGenerationPage = () => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handlePost = async (text: string) => {
    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    setLoading(true);

    const response = await ImageGenerationUseCase({ description: text });
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
                <GptMessageWithImage
                  key={index}
                  Icon={FaImage}
                  isErrorMessage={msg.isErrorMessage}
                  text={msg.text}
                  info={msg.info}
                />
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
      </div>
    </>
  );
};
