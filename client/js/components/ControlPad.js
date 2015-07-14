import React from 'react';
import {handleControlPadInput, handleControlPadInputEnd} from '../handleControlPadSignals';

const {EPSILON} = Number;

const validRatio = (x) => x < 0 ?
  0 :
  x >= 1 ?
    1 - EPSILON :
    x;

const calculateXAndYRatio = (e) => {
  const {top, right, bottom, left} = e.target.getBoundingClientRect();
  const clientXAndClientYObj = e.changedTouches && e.changedTouches[0] || e;
  const {clientX, clientY} = clientXAndClientYObj;
  const x = clientX - left;
  const y = clientY - top;
  const width = right - left;
  const height = bottom - top;

  return {
    xRatio: validRatio(x / width),
    yRatio: validRatio(y / height),
  };
};

let fadeLoopIsOn = false;
let mouseInputEnabled = false;
let context = null;
let controlPadActive = false;
let currentXYRatios = null;
let controlPadElement = null;

const drawTouchCircle = () => {
  if (!controlPadActive) return;
  const {xRatio, yRatio} = currentXYRatios;
  const {width, height} = controlPadElement;
  const x = xRatio * width;
  const y = yRatio * height;
  const r = width * 0.05;
  const gradient = context.createRadialGradient(x, y, r, x, y, 0);
  gradient.addColorStop(0, 'rgba(34, 165, 255, 1)');
  gradient.addColorStop(0.5, 'rgba(193, 245, 255, 0)');
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, true);
  context.closePath();
  context.fill();
};

export default class ControlPad extends React.Component {
  componentDidMount () {
    controlPadElement = document.querySelector('.control-pad');
    context = controlPadElement.getContext('2d');
    const {width, height} = controlPadElement;

    const drawBackground = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.1)';
      context.fillRect(0, 0, width, height);
    };

    fadeLoopIsOn = true;

    (function fadeLoop () {
      if (!fadeLoopIsOn) return;
      requestAnimationFrame(fadeLoop);
      drawTouchCircle();
      drawBackground();
    }());

    controlPadElement.oncontextmenu = (e) => e.preventDefault();
  }

  componentWillUnmount () {
    fadeLoopIsOn = false;
  }

  handleInput (e) {
    mouseInputEnabled = e.type === 'mousedown' ? true : mouseInputEnabled;
    if (e.nativeEvent instanceof MouseEvent && !mouseInputEnabled) return;
    controlPadActive = true;
    currentXYRatios = calculateXAndYRatio(e);
    handleControlPadInput(currentXYRatios);
  }

  handleInputEnd (e) {
    mouseInputEnabled = false;
    controlPadActive = false;
    currentXYRatios = calculateXAndYRatio(e);
    handleControlPadInputEnd(currentXYRatios);
  }

  render () {
    return <div className="center">
      <canvas width="768" height="768" className="control-pad"
        onTouchStart={this.handleInput}
        onTouchMove={this.handleInput}
        onMouseDown={this.handleInput}
        onMouseMove={this.handleInput}
        onTouchEnd={this.handleInputEnd}
        onMouseUp={this.handleInputEnd}>
      </canvas>
    </div>;
  }
}
