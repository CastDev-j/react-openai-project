import { MyMessage } from "@/components/chat-bubbles/MyMessage";
import { TextMessageBox } from "@/components/chat-input-boxes/TextMessageBox";
import { TypingLoader } from "@/components/loaders/TypingLoader";
import { useRef, useState, useEffect } from "react";
import { FaPenNib } from "react-icons/fa";
import { GptOrthograpfyMessage } from "./chat-bubbles/GptOrthographyMessage";
import { orthographyUseCase } from "@/core/use-cases/orthography.use-case";

interface Message {
  text: string;
  isGpt: boolean;
  isErrorMessage?: boolean;
  info?: {
    userScore?: number;
    errors?: string[];
    message?: string;
  };
}

const initialMessages: Message[] = [
  {
    text: "",
    isGpt: true,
    info: {
      message: "¡Bienvenido al apartado de correcciones! Aquí podrás mejorar la ortografía y gramática de tus textos para que sean más claros y profesionales. 😊",
    },
  },
];

export const OrthographyPage = () => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handlePost = async (text: string) => {
    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    const resp = await orthographyUseCase({ prompt: text });

    setLoading(false);
    if (!resp.ok) {
      return setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Orthography-GPT no está disponible en este momento",
          isGpt: true,
          isErrorMessage: true,
          info: {
            userScore: 0,
            errors: [],
            message: "Orthography-GPT no está disponible en este momento",
          },
        },
      ]);
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: resp.message,
        isGpt: true,
        isErrorMessage: false,
        info: {
          userScore: resp.userScore,
          errors: resp.errors,
          message: resp.message,
        },
      },
    ]);
  };

  return (
    <>
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2 scroll-y-active">
            {/* Renderizado de mensajes */}
            {messages.map((msg, index) =>
              msg.isGpt ? (
                <GptOrthograpfyMessage
                  key={index}
                  Icon={FaPenNib}
                  isErrorMessage={msg.isErrorMessage}
                  userScore={msg.info?.userScore ?? 0}
                  errors={msg.info?.errors ?? []}
                  message={msg.info?.message ?? ""}
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
          placeholder="Escribe un texto para corregir la ortografía"
          disableCorrections={true}
        />
      </div>
    </>
  );
};
