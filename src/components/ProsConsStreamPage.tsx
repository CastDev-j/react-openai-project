import { MyMessage } from "@/components/chat-bubbles/MyMessage";
import { TextMessageBox } from "@/components/chat-input-boxes/TextMessageBox";
import { TypingLoader } from "@/components/loaders/TypingLoader";
import { useRef, useState, useEffect } from "react";
import { FaStream } from "react-icons/fa";
import { GptMessage } from "@/components/chat-bubbles/GptMessage";
import { prosConsStreamDiscusserUseCase } from "@/core/use-cases/prosConsStreamDiscusser.use-case";

interface ProsConsStreamMessage {
  text: string;
  isGpt: boolean;
  isErrorMessage?: boolean;
}

const initialMessages: ProsConsStreamMessage[] = [
  {
    text: "Estás hablando con ProsConsStream-GPT, tu asistente para discutir pros y contras. 😊",
    isGpt: true,
    isErrorMessage: false,
  },
];

export const ProsConsStreamPage = () => {
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] =
    useState<ProsConsStreamMessage[]>(initialMessages);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handlePost = async (text: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }
    setLoading(true);
    isRunning.current = true;
    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    const stream = prosConsStreamDiscusserUseCase({
      prompt: text,
      abortSignal: abortController.current.signal,
    });
    setLoading(false);

    if (!stream) {
      return setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "ProsConsStream-GPT no está disponible en este momento",
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
        text: "",
      },
    ]);

    for await (const message of stream) {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].text = message;
        return newMessages;
      });
    }

    isRunning.current = false;
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
                  Icon={FaStream}
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
