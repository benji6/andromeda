import {always, assoc, clone, compose, cond, curry, equals, flip, gte, identity, lt, T} from 'ramda';
import React from 'react';
import alt from '../alt';
import {playNote, stopNote} from '../noteController';

const {floor} = Math;
const {EPSILON} = Number;

const calculatePitch = (xRatio) => {
  const scaleStoreState = alt.getStore('ScaleStore').getState();
  const {scaleName, scales} = scaleStoreState;
  const scale = scales[scaleName];
  return scale[floor(scale.length * xRatio)];
};

const minZeroMaxOne = cond(
  [flip(lt)(0), always(0)],
  [flip(gte)(1), always(1 - EPSILON)],
  [T, identity]
);

const calculateXAndYRatio = (e) => {
  const {top, right, bottom, left} = e.target.getBoundingClientRect();
  const clientXAndClientYObj = e.changedTouches && e.changedTouches[0] || e;
  const {clientX, clientY} = clientXAndClientYObj;
  const x = clientX - left;
  const y = clientY - top;
  const width = right - left;
  const height = bottom - top;

  return {
    xRatio: minZeroMaxOne(x / width),
    yRatio: minZeroMaxOne(y / height),
  };
};

const calculatePitchAndMod = ({xRatio, yRatio}) => ({pitch: calculatePitch(xRatio), modulation: yRatio});

const getNoteFromXYRatios = compose(assoc('id', 'controlPad'), calculatePitchAndMod);

let fadeLoopIsOn = false;
let mouseInputEnabled = false;
let context = null;
let controlPadActive = false;
let currentlyPlayingPitch = null;
let currentXYRatios = null;
let controlPadElement = null;

const drawTouchCircle = () => {
  if (!controlPadActive) {
    return;
  }
  const {xRatio, yRatio} = currentXYRatios;
  const {width, height} = controlPadElement;
  const x = xRatio * width;
  const y = yRatio * height;
  const r = width * 0.08;
  const gradient = context.createRadialGradient(x, y, r, x, y, 0);
  gradient.addColorStop(0, 'rgba(143, 0, 255, 0');
  gradient.addColorStop(0.5, 'rgba(143, 0, 255, 0.02');
  gradient.addColorStop(1, 'rgba(143, 245, 255, 1');
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
    const gradient = context.createLinearGradient(0, 0, width, height);

    gradient.addColorStop(0, 'rgb(200, 0, 90)');
    gradient.addColorStop(0.5, 'rgb(164, 0, 0)');
    gradient.addColorStop(1, 'rgb(140, 70, 0)');
    context.rect(0, 0, width, height);
    context.fillStyle = gradient;
    context.fill();

    const drawBackground = () => {
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(200, 0, 90, 0.15)');
      gradient.addColorStop(0.5, 'rgba(164, 0, 0, 0.15)');
      gradient.addColorStop(1, 'rgba(140, 70, 0, 0.15)');
      context.rect(0, 0, width, height);
      context.fillStyle = gradient;
      context.fill();
    };

    fadeLoopIsOn = true;

    (function fadeLoop () {
      if (!fadeLoopIsOn) return;
      window.requestAnimationFrame(fadeLoop);
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
    if (e.nativeEvent instanceof MouseEvent && !mouseInputEnabled)
      return;
    controlPadActive = true;
    currentXYRatios = calculateXAndYRatio(e);
    const note = getNoteFromXYRatios(currentXYRatios);
    const {id, pitch} = note;
    if (currentlyPlayingPitch !== pitch && currentlyPlayingPitch !== null) {
      stopNote({id, pitch: currentlyPlayingPitch});
    }
    currentlyPlayingPitch = pitch;
    playNote(note);
  }

  handleInputEnd (e) {
    mouseInputEnabled = false;
    controlPadActive = false;
    currentlyPlayingPitch = null;
    stopNote(getNoteFromXYRatios(calculateXAndYRatio(e)));
  }

  render () {
    return <div className="center">
      <canvas width="768" height="768" className="control-pad"
      onTouchStart={this.handleInput}
      onTouchMove={this.handleInput}
      onMouseDown={this.handleInput}
      onMouseMove={this.handleInput}
      onTouchEnd={this.handleInputEnd}
      onMouseUp={this.handleInputEnd}></canvas>
    </div>;
  }
}
