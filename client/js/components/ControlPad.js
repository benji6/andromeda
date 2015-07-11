import {always, assoc, clone, compose, cond, curry, equals, flip, gte, identity, isNil, lt, T} from 'ramda';
import React from 'react';
import alt from '../alt';
import {playNote, stopNote} from '../noteController';

const {floor} = Math;
const {EPSILON} = Number;

let stopLastNoteOnNoteChange = true;

const calculatePitch = (xRatio) => {
  const scaleStoreState = alt.getStore('ScaleStore').getState();
  const {scaleName, scales} = scaleStoreState;
  const scale = scales[scaleName];
  if (isNil(scale)) {
    stopLastNoteOnNoteChange = false;
    return xRatio * 12;
  }
  stopLastNoteOnNoteChange = true;
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
    context.fillStyle = 'rgb(164, 0, 0)';
    context.fillRect(0, 0, width, height);

    const drawBackground = () => {
      context.fillStyle = 'rgba(164, 0, 0, 0.15)';
      context.fillRect(0, 0, width, height);
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
    if (currentlyPlayingPitch !== pitch && currentlyPlayingPitch !== null && stopLastNoteOnNoteChange)
      stopNote({id, pitch: currentlyPlayingPitch});
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
