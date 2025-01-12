import { MyMessage } from "@/components/chat-bubbles/MyMessage";
import { TextMessageBox } from "@/components/chat-input-boxes/TextMessageBox";
import { TypingLoader } from "@/components/loaders/TypingLoader";
import { useRef, useState, useEffect } from "react";
import { FaBalanceScale, FaPenNib } from "react-icons/fa";
import { orthographyUseCase } from "@/core/use-cases/orthography.use-case";
import { GptMessage } from "./chat-bubbles/GptMessage";
import { prosConsDiscusserUseCase } from "@/core/use-cases/prosConsDiscusser.use-case";

interface ProsConsMessage {
  text: string;
  isGpt: boolean;
  isErrorMessage?: boolean;
}

const initialMessages: ProsConsMessage[] = [
  {
    text: "Estás hablando con ProsCons-GPT, tu asistente para discutir pros y contras. 😊",
    isGpt: true,
    isErrorMessage: false,
  },
];

export const ProsConsPage = () => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ProsConsMessage[]>(initialMessages);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handlePost = async (text: string) => {
    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    const resp = await prosConsDiscusserUseCase({ prompt: text });

    setLoading(false);

    if (!resp.ok) {
      return setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "ProsCons-GPT ha tenido un error",
          isGpt: true,
          isErrorMessage: true,
        },
      ]);
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        isGpt: true,
        isErrorMessage: false,
        text: resp.content,
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
                <GptMessage
                  key={index}
                  Icon={FaBalanceScale}
                  isErrorMessage={msg.isErrorMessage}
                  text={msg.text}
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
          placeholder="Escribe una comparación para analizar pros y contras"
          disableCorrections={true}
        />
      </div>
    </>
  );
};
