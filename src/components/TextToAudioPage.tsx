import { MyMessage } from "@/components/chat-bubbles/MyMessage";
import { TypingLoader } from "@/components/loaders/TypingLoader";
import { useRef, useState, useEffect } from "react";
import { FaPodcast } from "react-icons/fa";
import { GptMessage } from "@/components/chat-bubbles/GptMessage";
import { TextMessageBoxSelect } from "./chat-input-boxes/TextMessageBoxSelect";
import { textToAudioUseCase } from "@/core/use-cases/textToVoice.use-case";
import { GptMessageAudio } from "./chat-bubbles/GptMessageAudio";

interface TextToAudioMessage {
  text: string;
  isGpt: boolean;
  isErrorMessage?: boolean;
  audioUrl?: string;
}

const initialMessages: TextToAudioMessage[] = [
  {
    text: "Hola, soy TextToAudio-GPT, tu asistente para convertir texto en audio. 😊\n\n*Nota: Este contenido ha sido generado por una inteligencia artificial.*",
    isGpt: true,
    isErrorMessage: false,
  },
];

export const TextToAudioPage = () => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] =
    useState<TextToAudioMessage[]>(initialMessages);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handlePost = async (text: string, voice: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: text,
        isGpt: false,
        isErrorMessage: false,
      },
    ]);

    setLoading(true);

    const { ok, audioUrl, message } = await textToAudioUseCase({
      prompt: text,
      voice: voice,
    });

    setLoading(false);

    if (!ok) {
      return setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "TextToAudio-GPT ha tenido un error",
          isGpt: true,
          isErrorMessage: true,
        },
      ]);
    }

    return setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: message,
        isGpt: true,
        audioUrl: audioUrl,
        isErrorMessage: false,
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
                <GptMessageAudio
                  key={index}
                  Icon={FaPodcast}
                  isErrorMessage={msg.isErrorMessage}
                  text={msg.text}
                  audioUrl={msg.audioUrl}
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

        <TextMessageBoxSelect
          options={[
            {
              id: "nova",
              text: "nova",
            },
            {
              id: "alloy",
              text: "alloy",
            },
            {
              id: "echo",
              text: "echo",
            },
            {
              id: "fable",
              text: "fable",
            },
            {
              id: "onyx",
              text: "onyx",
            },
            {
              id: "shimmer",
              text: "shimmer",
            },
          ]}
          onSendMessage={handlePost}
          placeholder="Escribe un texto para convertir en audio"
          disableCorrections={true}
        />
      </div>
    </>
  );
};
