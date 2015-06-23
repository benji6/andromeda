import {fromEvent} from 'most';
import {equals} from 'ramda';
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
  const {clientX, clientY} = e.changedTouches[0];
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
      let touchPadActive = false;
      let currentlyPlayingPitch = null;

      const fromTouchPadEvent = curry(flip(fromEvent))(document.querySelector('.touch-pad'));

      fromTouchPadEvent('touchstart').merge(fromTouchPadEvent('touchmove'))
        .map(calculateXAndYRatio)
        .skipRepeatsWith((a, b) => touchPadActive && equals(a, b))
        .tap(() => touchPadActive = true)
        .map(calculatePitchAndMod)
        .tap(({pitch}) => (currentlyPlayingPitch !== pitch && currentlyPlayingPitch !== null) &&
          stopNote({pitch: currentlyPlayingPitch}))
        .tap(({pitch}) => currentlyPlayingPitch = pitch)
        .observe(playNote);

      fromTouchPadEvent('touchend')
        .map(calculateXAndYRatio)
        .tap(() => touchPadActive = false)
        .tap(() => currentlyPlayingPitch = null)
        .map(calculatePitchAndMod)
        .observe(stopNote);
    }

    render () {
      return <canvas className="touch-pad"></canvas>;
    }
  }

  React.render(<ControlPad />, document.querySelector('#app'));
};
