import { GptMessage } from "@/components/chat-bubbles/GptMessage";
import { MyMessage } from "@/components/chat-bubbles/MyMessage";
import { TextMessageBox } from "@/components/chat-input-boxes/TextMessageBox";
import { TypingLoader } from "@/components/loaders/TypingLoader";
import { useRef, useState, useEffect } from "react";
import { FaPenNib } from "react-icons/fa";

interface Message {
  text: string;
  isGpt: boolean;
}

const initialMessages: Message[] = [
  {
    text: "¡Hola! ¿En qué puedo ayudarte hoy?",
    isGpt: true,
  },
  {
    text: "Quiero saber más sobre la ortografía",
    isGpt: false,
  },
  {
    text: "¡Claro! ¿En qué te puedo ayudar?",
    isGpt: true,
  },
  {
    text: "¿Cuáles son las reglas de la B y la V?",
    isGpt: false,
  },
];

export const OrthographyPage = () => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Desplaza la vista al último mensaje
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handlePost = async (text: string) => {
    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    // Simular un tiempo de espera o llamar a la API
    setTimeout(() => {
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Respuesta simulada del servidor", isGpt: true },
      ]);
    }, 1000);
  };

  return (
    <>
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2 scroll-y-active">
            {/* Renderizado de mensajes */}
            {messages.map((msg, index) =>
              msg.isGpt ? (
                <GptMessage key={index} text={msg.text} Icon={FaPenNib}/>
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
          placeholder="Escribe un mensaje"
          disableCorrections={true}
        />
      </div>
    </>
  );
};
