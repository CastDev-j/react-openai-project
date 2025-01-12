import { MyMessage } from "@/components/chat-bubbles/MyMessage";
import { TextMessageBox } from "@/components/chat-input-boxes/TextMessageBox";
import { TypingLoader } from "@/components/loaders/TypingLoader";
import { useRef, useState, useEffect } from "react";
import { FaLanguage } from "react-icons/fa";
import { GptMessage } from "@/components/chat-bubbles/GptMessage";
import { translateUseCase } from "@/core/use-cases/translate.use-case";

interface TranslateMessage {
  text: string;
  isGpt: boolean;
  isErrorMessage?: boolean;
}

const initialMessages: TranslateMessage[] = [
  {
    text: "¡Bienvenido al traductor! Aquí podrás traducir texto a otro idioma. 😊 Soy Translator-GPT.",
    isGpt: true,
    isErrorMessage: false,
  },
];

export const TranslatePage = () => {
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<TranslateMessage[]>(initialMessages);

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

    try {
      const stream = translateUseCase({
        prompt: text,
        abortSignal: abortController.current.signal,
      });

      setLoading(false);

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
          newMessages[newMessages.length - 1].isErrorMessage = false;   
          return newMessages;
        });
      }

      isRunning.current = false;
    } catch (error) {

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages.pop();
        return newMessages;
      });

      return setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Translate-GPT ha tenido un error",
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
                <GptMessage
                  key={index}
                  Icon={FaLanguage}
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
          placeholder="Escribe el texto que deseas traducir y el idioma al que deseas traducirlo."
          disableCorrections={true}
        />
      </div>
    </>
  );
};
