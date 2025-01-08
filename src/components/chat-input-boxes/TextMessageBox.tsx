import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useRef, useEffect } from "react";

interface TextMessageBoxProps {
  onSendMessage: (message: string) => void;
  placeholder: string;
  disableCorrections?: boolean;
}

export const TextMessageBox = ({
  onSendMessage,
  placeholder,
  disableCorrections,
}: TextMessageBoxProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim().length === 0) return;

    onSendMessage(message);
    setMessage("");
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToTextArea = () => {
    textAreaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTextArea();
  }, []);

  return (
    <>
      <form
        onSubmit={handleSendMessage}
        className="flex flex-col gap-4 px-2 py-3 items-center rounded-xl bg-neutral-700"
      >
        <div className="flex-grow w-full">
          <textarea
            autoFocus
            name="message"
            className="flex w-full rounded-lg px-4 py-2 bg-neutral-700 placeholder-neutral-300 text-neutral-100 outline-none resize-none"
            placeholder={placeholder}
            autoComplete={disableCorrections ? "off" : "on"}
            autoCorrect={disableCorrections ? "off" : "on"}
            spellCheck={disableCorrections ? "false" : "true"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            ref={textAreaRef}
          />
        </div>

        <div className="flex w-full justify-end">
          <button
            type="submit"
            disabled={message.trim().length === 0}
            className={`flex items-center justify-center px-4 py-2 rounded-lg gap-2 bg-neutral-100 text-neutral-900 hover:bg-neutral-400 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-800`}
          >
            <span>Enviar</span>
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </>
  );
};
