import Markdown from "react-markdown";

interface MyMessageProps {
  text: string;
  audioUrl?: string;
}
export const MyMessageWithAudio = ({ text, audioUrl }: MyMessageProps) => {
  return (
    <>
      <div className="col-start-3 col-end-13 p-3 rounded-lg fade-up">
        <div className="flex items-center justify-start flex-row-reverse">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 flex-shrink-0">
            A
          </div>
          <div className="relative mr-3 flex flex-col gap-2 text-sm bg-indigo-700 py-3 px-4 w-auto rounded-xl break-words whitespace-pre-wrap">
            <p>{text}</p>
            {!audioUrl ? (
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
