import { Component } from "react";
import Token from "./Token";
import { eventRatiosAndCoords } from "../../../utils/dom";

interface Props {
  sideLength: number;
  isTouched: boolean;
  controlPadTouched: () => void;
  inputStartHandler: (ratios: any) => void;
  inputModifyHandler: (ratios: any) => void;
  inputStopHandler: () => void;
}

let currentXYRatios = null;
let controlPadElement = null;
let mouseInputEnabled = false;
let controlPadActive = false;

export default class extends Component<Props> {
  token: Token;
  el: HTMLCanvasElement;

  componentDidMount() {
    this.token = new Token({
      gl: this.el.getContext("webgl"),
      sideLength: this.props.sideLength,
    });

    controlPadElement = this.el;

    const inputCallback = (e) => {
      const { inputStartHandler, inputModifyHandler } = this.props;
      mouseInputEnabled = e.type === "mousedown" ? true : mouseInputEnabled;
      if (e instanceof window.MouseEvent && !mouseInputEnabled) return;
      this.props.isTouched || this.props.controlPadTouched();
      currentXYRatios = eventRatiosAndCoords(e);
      this.token.handleInput(currentXYRatios);
      if (controlPadActive) return inputModifyHandler(currentXYRatios);
      controlPadActive = true;
      inputStartHandler(currentXYRatios);
    };

    controlPadElement.addEventListener("touchstart", inputCallback);
    controlPadElement.addEventListener("touchmove", inputCallback);
    controlPadElement.addEventListener("mousedown", inputCallback);
    controlPadElement.addEventListener("mousemove", inputCallback);

    const inputEndCallback = () => {
      controlPadActive = mouseInputEnabled = false;
      this.props.inputStopHandler();
      this.token.handleInputEnd();
    };

    controlPadElement.addEventListener("touchend", inputEndCallback);
    controlPadElement.addEventListener("mouseup", inputEndCallback);

    controlPadElement.oncontextmenu = (e) => e.preventDefault();
  }

  componentDidUpdate() {
    this.token.handleResize(this.props.sideLength);
  }

  render() {
    const { sideLength } = this.props;
    return (
      <div className="ControlPad">
        {!this.props.isTouched && (
          <div className="ControlPad__Message">TOUCH / CLICK TO PLAY</div>
        )}
        <canvas
          className="ControlPad__Canvas"
          height={sideLength}
          ref={(el) => {
            this.el = el;
          }}
          width={sideLength}
        />
      </div>
    );
  }
}
