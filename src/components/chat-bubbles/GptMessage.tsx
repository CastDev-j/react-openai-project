import Markdown from "react-markdown";

interface GptMessageProps {
  text: string;
}
export const GptMessage = ({ text }: GptMessageProps) => {
  return (
    <>
      <div className="col-start-1 col-end-12 p-3 rounded-lg fade-up">
        <div className="flex flex-row items-start">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0">
            G
          </div>
          <div className="relative ml-3 text-sm bg-black bg-opacity-25 py-3 px-4 rounded-xl">
            <Markdown>{text}</Markdown>
          </div>
        </div>
      </div>
    </>
  );
};
