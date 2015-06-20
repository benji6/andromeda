import React from 'react';
import {always, cond, flip, gte, identity, lt, T} from 'ramda';
import {playNote, stopNote} from './noteController';
import {major} from './scales';
const {floor} = Math;
const {EPSILON} = Number;

const minZeroMaxOne = cond(
  [flip(lt)(0), always(0)],
  [flip(gte)(1), always(1 - EPSILON)],
  [T, identity]
);

const calculatePitch = (xRatio) => major[floor(8 * xRatio)];

export default () => {
  class ControlPad extends React.Component {
    handleInput (e) {
      const {top, right, bottom, left} = e.target.getBoundingClientRect();
      const {clientX, clientY} = e.changedTouches[0];
      const x = clientX - left;
      const y = clientY - top;
      const width = right - left;
      const height = bottom - top;

      const xRatio = minZeroMaxOne(x / width);
      const yRatio = minZeroMaxOne(y / height);

      if (xRatio !== this.props.currentXRatio) {
        playNote(calculatePitch(xRatio));
        this.props.currentXRatio = xRatio;
      }
    }

    componentDidMount () {
      this.props.currentXRatio = null;
      this.props.currentYRatio = null;
    }

    handleInputEnd () {
      stopNote();
    }

    render () {
      return <canvas className="touch-pad"
        onTouchStart={this.handleInput.bind(this)}
        onTouchMove={this.handleInput.bind(this)}
        onTouchEnd={this.handleInputEnd.bind(this)}></canvas>;
    }
  }

  React.render(<ControlPad />, document.querySelector('#app'));
};
