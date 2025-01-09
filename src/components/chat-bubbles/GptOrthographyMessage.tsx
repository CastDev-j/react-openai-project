import type { ComponentType, SVGProps } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface GptOrthograpfyMessageProps {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  isErrorMessage?: boolean;
  userScore: number;
  errors: string[];
  message: string;
}
export const GptOrthograpfyMessage = ({
  Icon,
  isErrorMessage,
  errors,
  message,
  userScore,
}: GptOrthograpfyMessageProps) => {
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
            {errors.length == 0 ? (
              <Markdown>{message}</Markdown>
            ) : (
              <>
                {/* Puntuación */}
                <div className="mb-4 text-right">
                  <h2 className="text-xl font-bold">
                    Puntaje:{" "}
                    <span
                      className={`text-4xl ${
                        userScore >= 70 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {userScore}
                    </span>
                  </h2>
                </div>

                {/* Mensaje */}
                <div className="mb-4">
                  <p className="text-sm text-neutral-100">{message}</p>
                </div>

                {/* Errores */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Errores:</h3>
                  <ul className="list-disc list-inside">
                    {errors.map((error, index) => {
                      const [incorrect, correct] = error.split(" -> ");
                      return (
                        <li key={index} className="mb-1 list-none ml-4">
                          <span className="text-red-500">{incorrect}</span>{" "}
                          <span className="text-neutral-500">→</span>{" "}
                          <span className="text-green-500">{correct}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}

            <Markdown></Markdown>
          </div>
        </div>
      </div>
    </>
  );
};
