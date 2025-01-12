import { TypingLoader } from "@/components/loaders/TypingLoader";
import { useRef, useState, useEffect } from "react";
import { FaCommentDots } from "react-icons/fa";
import { TextMessageBoxFile } from "./chat-input-boxes/TextMessageBoxFile";
import { audioToTextUseCase } from "@/core/use-cases/audioToText.use-case";
import { MyMessageWithAudio } from "./chat-bubbles/MyMessageWithAudio";
import { GptMessage } from "./chat-bubbles/GptMessage";

interface AudioToTextMessage {
  text: string;
  isGpt: boolean;
  isErrorMessage?: boolean;
  audioUrl?: string;
}

const initialMessages: AudioToTextMessage[] = [
  {
    text: "Hola, soy  AudioToText-GPT, tu asistente para convertir audio en texto. 😊\n\n*Nota: El lenguaje soportado es Español.*",
    isGpt: true,
    isErrorMessage: false,
  },
];

export const AudioToTextPage = () => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] =
    useState<AudioToTextMessage[]>(initialMessages);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handlePost = async (prompt: string, audio: File) => {
    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: prompt,
        audioUrl: URL.createObjectURL(audio),
        isGpt: false,
        isErrorMessage: false,
      },
    ]);

    const response = await audioToTextUseCase({
      prompt,
      audio,
    });

    setLoading(false);

    if (!response.ok) {
      return setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "AudioToText-GPT ha tenido un error",
          isGpt: true,
          isErrorMessage: true,
        },
      ]);
    }    

    return setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: response.text,
        isGpt: true,
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
                <GptMessage
                  key={index}
                  Icon={FaCommentDots}
                  isErrorMessage={msg.isErrorMessage}
                  text={(index === 0 || msg.isErrorMessage) ? msg.text : `**Transcripción del audio:**\n\n${msg.text}`}
                />
              ) : (
                <MyMessageWithAudio
                  key={index}
                  text={msg.text}
                  audioUrl={msg.audioUrl}
                />
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

        <TextMessageBoxFile
          onSendMessage={handlePost}
          placeholder="Sube un archivo de audio para convertir en texto, puedes incluir instrucciones adicionales"
          disableCorrections={true}
          accept="audio/*"
        />
      </div>
    </>
  );
};
