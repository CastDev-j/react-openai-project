import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";

interface Props {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  imageUrl: string;
  alt?: string;
  onImageSelected?: (image: string) => void;
}

export const GptMessageWithSelectableImage = ({
  imageUrl,
  Icon,
  onImageSelected,
}: Props) => {
  const originalImageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = imageUrl;

    originalImageRef.current = image;

    image.onload = () => {
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  const onMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    setIsDrawing(true);

    const startX =
      event.clientX - canvasRef.current!.getBoundingClientRect().left;
    const startY =
      event.clientY - canvasRef.current!.getBoundingClientRect().top;

    setCoords({ x: startX, y: startY });
  };

  const onMouseUp = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current!;
    const url = canvas.toDataURL("image/png");
    
    onImageSelected && onImageSelected(url);
  };

  const onMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) return;

    const currentX =
      event.clientX - canvasRef.current!.getBoundingClientRect().left;
    const currentY =
      event.clientY - canvasRef.current!.getBoundingClientRect().top;

    const width = currentX - coords.x;
    const height = currentY - coords.y;

    const canvaWidth = canvasRef.current!.width;
    const canvaHeight = canvasRef.current!.height;

    const ctx = canvasRef.current!.getContext("2d")!;

    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.drawImage(originalImageRef.current!, 0, 0, canvaWidth, canvaHeight);

    // Dibujar el rectangulo, pero en este caso, limpiaremos el espacio
    // ctx.fillRect(coords.x, coords.y, width, height);
    ctx.clearRect(coords.x, coords.y, width, height);
  };

  const resetCanvas = () => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.drawImage(
      originalImageRef.current!,
      0,
      0,
      canvasRef.current!.width,
      canvasRef.current!.height
    );

    onImageSelected && onImageSelected(imageUrl);
  };

  return (
    <>
      <div className="col-start-1 col-end-12 p-3 rounded-lg fade-up">
        <div className="flex flex-row items-start">
          <div
            className={`flex items-center justify-center w-10 h-10 bg-opacity-50 rounded-full p-2`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-opacity-50 rounded-full p-2 bg-black">
              <Icon
                className="w-8 h-8 text-white text-opacity-50"
                aria-hidden="true"
              />
            </div>
          </div>

          <div
            className={`relative ml-3 text-sm bg-opacity-25 rounded-xl w-10/12`}
          >
            <canvas
              ref={canvasRef}
              width={1024}
              height={1024}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}

            />

            <button
              className="bg-neutral-500 text-white rounded-sm px-2 py-1 mt-2 bg-opacity-50 hover:bg-opacity-100 transition-colors"
              onClick={resetCanvas}
            >
              Borrar selección
            </button>

          </div>
        </div>
      </div>
    </>
  );
};
