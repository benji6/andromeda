import {fromEvent} from 'most';
import {assoc, equals} from 'ramda';
import React from 'react';
import {always, cond, curry, flip, gte, identity, lt, T} from 'ramda';
import {playNote, stopNote} from './noteController';
import {major} from './scales';

const {floor} = Math;
const {EPSILON} = Number;
const calculatePitch = (xRatio) => major[floor(major.length * xRatio)];

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

export default () => {
  class ControlPad extends React.Component {
    componentDidMount () {
      let currentlyPlayingPitch = null;
      let mouseInputEnabled = false;
      let touchPadActive = false;
      let fadeLoopIsOn = false;
      const touchPadElement = document.querySelector('.touch-pad');
      const context = touchPadElement.getContext('2d');
      const fromTouchPadEvent = curry(flip(fromEvent))(touchPadElement);
      const {width, height} = touchPadElement;
      const gradient = context.createLinearGradient(0, 0, width, height);

      gradient.addColorStop(0, 'rgb(200, 0, 90)');
      gradient.addColorStop(0.5, 'rgb(164, 0, 0)');
      gradient.addColorStop(1, 'rgb(140, 70, 0)');
      context.rect(0, 0, width, height);
      context.fillStyle = gradient;
      context.fill();

      const fade = () => {
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(200, 0, 90, 0.15)');
        gradient.addColorStop(0.5, 'rgba(164, 0, 0, 0.15)');
        gradient.addColorStop(1, 'rgba(140, 70, 0, 0.15)');
        context.rect(0, 0, width, height);
        context.fillStyle = gradient;
        context.fill();
      };

      function fadeLoop () {
        if (!fadeLoopIsOn) {
          return;
        }
        window.requestAnimationFrame(fadeLoop);
        fade();
      }

      const turnFadeLoopOn = () => {
        fadeLoopIsOn = true;
        fadeLoop();
      };

      const turnFadeLoopOff = () => fadeLoopIsOn = false;

      touchPadElement.oncontextmenu = (e) => e.preventDefault();

      fromTouchPadEvent('touchstart')
        .merge(fromTouchPadEvent('touchmove'))
        .merge(fromTouchPadEvent('mousemove'))
        .merge(fromTouchPadEvent('mousedown'))
        .tap(({type}) => mouseInputEnabled = type === 'mousedown' ? true : mouseInputEnabled)
        .filter((e) => !(e instanceof MouseEvent && !mouseInputEnabled))
        .map(calculateXAndYRatio)
        .tap(turnFadeLoopOff)
        .tap(fade)
        .tap(({xRatio, yRatio}) => {
          const {width, height} = touchPadElement;
          const x = xRatio * width;
          const y = yRatio * height;
          const r = width * 0.08;
          var gradient = context.createRadialGradient(x, y, r, x, y, 0);
          gradient.addColorStop(0, 'rgba(143, 0, 255, 0');
          gradient.addColorStop(0.5, 'rgba(143, 0, 255, 0.02');
          gradient.addColorStop(1, 'rgba(143, 245, 255, 1');
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(x, y, r, 0, 2 * Math.PI, true);
          context.closePath();
          context.fill();
        })
        .skipRepeatsWith((a, b) => touchPadActive && equals(a, b))
        .tap(() => touchPadActive = true)
        .map(calculatePitchAndMod)
        .map((note) => assoc('id', 'touchpad', note))
        .tap(({id, pitch}) => (currentlyPlayingPitch !== pitch && currentlyPlayingPitch !== null) &&
          stopNote({id, pitch: currentlyPlayingPitch}))
        .tap(({pitch}) => currentlyPlayingPitch = pitch)
        .observe(playNote);

      fromTouchPadEvent('touchend')
        .merge(fromEvent('mouseup', document))
        .tap(() => mouseInputEnabled = false)
        .map(calculateXAndYRatio)
        .tap(() => touchPadActive = false)
        .tap(() => currentlyPlayingPitch = null)
        .map(calculatePitchAndMod)
        .map((note) => assoc('id', 'touchpad', note))
        .tap(turnFadeLoopOn)
        .observe(stopNote);
    }

    render () {
      return <canvas width="768" height="768" className="touch-pad"></canvas>;
    }
  }

  React.render(<ControlPad />, document.querySelector('#app'));
};
