import { useEffect, useRef } from "react";
import Token from "./Token";
import { eventRatiosAndCoords } from "../../../utils/dom";
import { useDispatch } from "react-redux";
import controlPadSlice from "../../../store/controlPadSlice";

interface Props {
  sideLength: number;
  isTouched: boolean;
  inputStartHandler: (ratios: any) => void;
  inputModifyHandler: (ratios: any) => void;
  inputStopHandler: () => void;
}

let currentXYRatios = null;
let mouseInputEnabled = false;
let controlPadActive = false;

export default function ControlPad({
  sideLength,
  isTouched,
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

    const inputCallback = (e) => {
      mouseInputEnabled = e.type === "mousedown" ? true : mouseInputEnabled;
      if (e instanceof window.MouseEvent && !mouseInputEnabled) return;
      isTouched || dispatch(controlPadSlice.actions.isTouched());
      currentXYRatios = eventRatiosAndCoords(e);
      tokenRef.current?.handleInput(currentXYRatios);
      if (controlPadActive) return inputModifyHandler(currentXYRatios);
      controlPadActive = true;
      inputStartHandler(currentXYRatios);
    };

    const inputEndCallback = () => {
      controlPadActive = mouseInputEnabled = false;
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
  }, [isTouched, inputStartHandler, inputModifyHandler, inputStopHandler]);

  useEffect(() => {
    tokenRef.current?.handleResize(sideLength);
  }, [sideLength]);

  return (
    <div className="ControlPad">
      {!isTouched && (
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
