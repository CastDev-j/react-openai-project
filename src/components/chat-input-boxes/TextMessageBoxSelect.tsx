import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useRef, useEffect } from "react";

interface TextMessageBoxSelectProps {
  onSendMessage: (message: string, selectedOption: string) => void;
  placeholder: string;
  disableCorrections?: boolean;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
}

export const TextMessageBoxSelect = ({
  onSendMessage,
  placeholder,
  disableCorrections = false,
  options,
}: TextMessageBoxSelectProps) => {
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToTextArea = () => {
    textAreaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTextArea();
  }, []);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim().length === 0) return;

    onSendMessage(message, selectedOption);
    setMessage("");
  };

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

        <div className="flex w-full justify-between gap-6">
          <select
            name="select"
            onChange={(e) => setSelectedOption(e.target.value)}
            className="flex w-full rounded-lg px-4 py-2 bg-neutral-700 placeholder-neutral-300 text-neutral-100 outline-none resize-none"
          >
            <option value="">Selecciona una opción</option>
            {options.map(({ id, text }) => (
              <option key={id} value={id}>
                {text}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={
              message.trim().length === 0 || selectedOption.trim().length === 0
            }
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
