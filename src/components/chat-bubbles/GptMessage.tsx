import type { ComponentType, SVGProps } from "react";
import Markdown from "react-markdown";

interface GptMessageProps {
  text: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}
export const GptMessage = ({ text, Icon }: GptMessageProps) => {
  return (
    <>
      <div className="col-start-1 col-end-12 p-3 rounded-lg fade-up">
        <div className="flex flex-row items-start">
          <div className="flex items-center justify-center w-10 h-10 bg-neutral-950 bg-opacity-50 rounded-full p-2">
            <Icon
              className="w-8 h-8 text-white text-opacity-50"
              aria-hidden="true"
            />
          </div>
          <div className="relative ml-3 text-sm bg-black bg-opacity-25 py-3 px-4 rounded-xl">
            <Markdown>{text}</Markdown>
          </div>
        </div>
      </div>
    </>
  );
};
