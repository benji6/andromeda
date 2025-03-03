import { useEffect, useRef } from "react";
import Token from "./Token";
import { useDispatch } from "react-redux";
import controlPadSlice from "../../../store/controlPadSlice";

interface Props {
  sideLength: number;
  hasBeenTouched: boolean;
  inputStartHandler: (ratios: any) => void;
  inputModifyHandler: (ratios: any) => void;
  inputStopHandler: () => void;
}

let mouseInputEnabled = false;
let controlPadActive = false;

const validRatio = (n: number) => Math.max(0, Math.min(1 - Number.EPSILON, n));

const eventRatiosAndCoords = (
  e,
): { x: number; xRatio: number; y: number; yRatio: number } => {
  const { top, right, bottom, left } = e.target.getBoundingClientRect();
  const [width, height] = [right - left, bottom - top];
  const { clientX, clientY } = (e.changedTouches && e.changedTouches[0]) || e;
  const [x, y] = [clientX - left, clientY - top];
  return {
    x,
    xRatio: validRatio(x / width),
    y,
    yRatio: validRatio(1 - y / height),
  };
};

export default function ControlPad({
  sideLength,
  hasBeenTouched,
  inputStartHandler,
  inputModifyHandler,
  inputStopHandler,
}: Props) {
  const dispatch = useDispatch();
  const tokenRef = useRef<Token | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | undefined>(undefined);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasEl = canvasRef.current;

    if (!tokenRef.current) {
      tokenRef.current = new Token({
        gl: canvasEl.getContext("webgl"),
        sideLength,
      });
    }

    const inputCallback = (e: MouseEvent | TouchEvent): void => {
      mouseInputEnabled = e.type === "mousedown" ? true : mouseInputEnabled;
      if (e instanceof window.MouseEvent && !mouseInputEnabled) return;
      const currentXYRatios = eventRatiosAndCoords(e);
      dispatch(
        controlPadSlice.actions.setCurrentCoordinateRatios({
          x: currentXYRatios.xRatio,
          y: currentXYRatios.yRatio,
        }),
      );
      tokenRef.current?.handleInput(currentXYRatios);
      if (controlPadActive) return inputModifyHandler(currentXYRatios);
      controlPadActive = true;
      inputStartHandler(currentXYRatios);
    };

    const inputEndCallback = () => {
      controlPadActive = mouseInputEnabled = false;
      dispatch(controlPadSlice.actions.setCurrentCoordinateRatios(undefined));
      inputStopHandler();
      tokenRef.current?.handleInputEnd();
    };

    canvasEl.addEventListener("touchstart", inputCallback);
    canvasEl.addEventListener("touchmove", inputCallback);
    canvasEl.addEventListener("mousedown", inputCallback);
    canvasEl.addEventListener("mousemove", inputCallback);
    canvasEl.addEventListener("touchend", inputEndCallback);
    canvasEl.addEventListener("mouseup", inputEndCallback);

    canvasEl.oncontextmenu = (e) => e.preventDefault();

    return () => {
      canvasEl.removeEventListener("touchstart", inputCallback);
      canvasEl.removeEventListener("touchmove", inputCallback);
      canvasEl.removeEventListener("mousedown", inputCallback);
      canvasEl.removeEventListener("mousemove", inputCallback);
      canvasEl.removeEventListener("touchend", inputEndCallback);
      canvasEl.removeEventListener("mouseup", inputEndCallback);
      canvasEl.oncontextmenu = null;
    };
  }, [inputStartHandler, inputModifyHandler, inputStopHandler]);

  useEffect(() => {
    tokenRef.current?.handleResize(sideLength);
  }, [sideLength]);

  return (
    <div className="ControlPad">
      {!hasBeenTouched && (
        <div className="ControlPad__Message">TOUCH / CLICK TO PLAY</div>
      )}
      <canvas
        className="ControlPad__Canvas"
        height={sideLength}
        ref={canvasRef}
        width={sideLength}
      />
    </div>
  );
}
