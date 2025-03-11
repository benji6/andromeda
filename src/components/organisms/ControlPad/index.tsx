import { useEffect, useRef } from "react";
import Token, { RatiosAndCoords } from "./Token";
import { useDispatch } from "react-redux";
import controlPadSlice from "../../../store/controlPadSlice";

interface Props {
  sideLength: number;
  hasBeenTouched: boolean;
}

let mouseInputEnabled = false;

const validRatio = (n: number) => Math.max(0, Math.min(1 - Number.EPSILON, n));

const eventRatiosAndCoords = (e: MouseEvent | TouchEvent): RatiosAndCoords => {
  if (!(e.target instanceof HTMLElement))
    throw Error("Invalid control pad element");
  const { top, right, bottom, left } = e.target.getBoundingClientRect();
  const [width, height] = [right - left, bottom - top];
  let clientX: number, clientY: number;
  if ("changedTouches" in e && e.changedTouches[0]) {
    clientX = e.changedTouches[0].clientX;
    clientY = e.changedTouches[0].clientY;
  } else if ("clientX" in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  } else {
    throw new Error("Unexpected event type");
  }
  const [x, y] = [clientX - left, clientY - top];
  return {
    x,
    xRatio: validRatio(x / width),
    y,
    yRatio: validRatio(1 - y / height),
  };
};

export default function ControlPad({ sideLength, hasBeenTouched }: Props) {
  const dispatch = useDispatch();
  const tokenRef = useRef<Token | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasEl = canvasRef.current;

    if (!tokenRef.current) {
      const context = canvasEl.getContext("webgl");
      if (!context) throw Error("WebGL not supported");
      tokenRef.current = new Token({
        gl: context,
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
    };

    const inputEndCallback = () => {
      mouseInputEnabled = false;
      dispatch(controlPadSlice.actions.setCurrentCoordinateRatios(undefined));
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
  }, []);

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
