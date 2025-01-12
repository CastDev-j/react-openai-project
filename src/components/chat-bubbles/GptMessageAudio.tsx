import type { ComponentType, SVGProps } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface GptMessageProps {
  text: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  isErrorMessage?: boolean;
  audioUrl?: string;
}
export const GptMessageAudio = ({
  text,
  Icon,
  isErrorMessage,
  audioUrl,
}: GptMessageProps) => {
  return (
    <>
      <div className="col-start-1 col-end-12 p-3 rounded-lg fade-up">
        <div className="flex flex-row items-start">
          <div
            className={`flex items-center justify-center w-10 h-10 bg-opacity-50 rounded-full p-2 ${
              isErrorMessage ? "bg-red-500" : "bg-black"
            }`}
          >
            <Icon
              className="w-8 h-8 text-white text-opacity-50"
              aria-hidden="true"
            />
          </div>
          <div
            className={`relative ml-3 text-sm bg-opacity-25 py-3 px-4 rounded-xl ${
              isErrorMessage ? "bg-red-500" : "bg-black"
            }`}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
            {(isErrorMessage || !audioUrl) ? (
              ""
            ) : (
              <audio src={audioUrl} controls className="w-full min-w-56" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
