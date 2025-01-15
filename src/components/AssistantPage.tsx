import { MyMessage } from "@/components/chat-bubbles/MyMessage";
import { TextMessageBox } from "@/components/chat-input-boxes/TextMessageBox";
import { TypingLoader } from "@/components/loaders/TypingLoader";
import { useRef, useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { createThreadUseCase } from "@/core/use-cases/create-thread.use-case";
import { askQuestionUseCase } from "@/core/use-cases/ask-question.use-case";
import { GptMessageWithMathSupport } from "./chat-bubbles/GptMessageWithMathSupport";

interface AssistantMessage {
  text: string;
  isGpt: boolean;
  isErrorMessage?: boolean;
}

const initialMessages: AssistantMessage[] = [
  {
    text: "¡Bienvenido al Asistente de Calculo Vectorial! ¿En qué puedo ayudarte?",
    isGpt: true,
    isErrorMessage: false,
  }
];

export const AssistantPage = () => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);

  const [threadId, setthreadId] = useState<string>();

  useEffect(() => {
    const theadId = localStorage.getItem("threadId");

    if (theadId) {
      setthreadId(theadId);
    } else {
      createThreadUseCase().then((id) => {
        setthreadId(id);
        localStorage.setItem("threadId", id);
      });
    }
  }, []);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handlePost = async (question: string) => {
    if (!threadId)
      return alert("Error al crear el hilo de mensajes, recarga la página");

    setMessages((prev) => [...prev, { text: question, isGpt: false }]);

    setLoading(true);
    const response = await askQuestionUseCase(threadId, question);
    setLoading(false);

    if (response.ok) {
      const { replies } = response;

      if (!replies) return alert("Error al obtener la respuesta del asistente");

      const lastMessage = replies[replies.length - 1];
      setMessages((prev) => [
        ...prev,
        {
          text: lastMessage.content[0],
          isGpt: lastMessage.role === "assistant",
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: response.message, isGpt: true, isErrorMessage: true },
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
                <GptMessageWithMathSupport
                  key={index}
                  Icon={FaUser}
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
          placeholder="Escribe sobre lo que necesitas ayuda..."
          disableCorrections={true}
        />
      </div>
    </>
  );
};
