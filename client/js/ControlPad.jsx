import {fromEvent} from 'most';
import {equals} from 'ramda';
import React from 'react';
import {always, cond, curry, flip, gte, identity, lt, T} from 'ramda';
import {inputXY, inputStop} from './handleTouchPadInput';
const {EPSILON} = Number;

const minZeroMaxOne = cond(
  [flip(lt)(0), always(0)],
  [flip(gte)(1), always(1 - EPSILON)],
  [T, identity]
);

export default () => {
  class ControlPad extends React.Component {
    componentDidMount () {
      let touchPadActive = false;
      const fromTouchPadEvent = curry(flip(fromEvent))(document.querySelector('.touch-pad'));

      fromTouchPadEvent('touchstart').merge(fromTouchPadEvent('touchmove'))
        .map((e) => {
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
        })
        .skipRepeatsWith((a, b) => touchPadActive && equals(a, b))
        .tap(() => touchPadActive = true)
        .observe(({xRatio, yRatio}) => inputXY(xRatio, yRatio));

      fromTouchPadEvent('touchend')
        .tap(() => touchPadActive = false)
        .observe(inputStop);
    }

    render () {
      return <canvas className="touch-pad"></canvas>;
    }
  }

  React.render(<ControlPad />, document.querySelector('#app'));
};
