import Markdown from "react-markdown";

interface GptMessageProps {
  text: string;
}
export const MyMessage = ({ text }: GptMessageProps) => {
  return (
    <>
      <div className="col-start-3 col-end-13 p-3 rounded-lg fade-up">
        <div className="flex items-center justify-start flex-row-reverse">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 flex-shrink-0">
            A
          </div>
          <div className="relative mr-3 text-sm bg-indigo-700 py-3 px-4 w-auto rounded-xl break-words whitespace-pre-wrap">
            {text}
          </div>
        </div>
      </div>
    </>
  );
};
