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
      const touchPadElement = document.querySelector('.touch-pad');
      const fromTouchPadEvent = curry(flip(fromEvent))(touchPadElement);

      touchPadElement.oncontextmenu = (e) => e.preventDefault();

      fromTouchPadEvent('touchstart')
        .merge(fromTouchPadEvent('touchmove'))
        .merge(fromTouchPadEvent('mousemove'))
        .filter((e) => !(e instanceof MouseEvent && !mouseInputEnabled))
        .map(calculateXAndYRatio)
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
        .observe(stopNote);

      fromTouchPadEvent('mousedown')
        .observe(() => mouseInputEnabled = true);
    }

    render () {
      return <canvas className="touch-pad"></canvas>;
    }
  }

  React.render(<ControlPad />, document.querySelector('#app'));
};
