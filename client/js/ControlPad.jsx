import React from 'react';
import {always, cond, flip, gte, identity, lt, T} from 'ramda';
import {inputXY, inputStop} from './handleTouchPadInput';
const {EPSILON} = Number;

const minZeroMaxOne = cond(
  [flip(lt)(0), always(0)],
  [flip(gte)(1), always(1 - EPSILON)],
  [T, identity]
);

export default () => {
  class ControlPad extends React.Component {
    handleInput (e) {
      const {currentXRatio, currentYRatio} = this.props;
      const {top, right, bottom, left} = e.target.getBoundingClientRect();
      const {clientX, clientY} = e.changedTouches[0];
      const x = clientX - left;
      const y = clientY - top;
      const width = right - left;
      const height = bottom - top;

      const xRatio = minZeroMaxOne(x / width);
      const yRatio = minZeroMaxOne(y / height);

      if (xRatio !== currentXRatio || yRatio !== currentYRatio) {
        this.props.currentXRatio = xRatio;
        this.props.currentYRatio = yRatio;
        inputXY(xRatio, yRatio);
      }
    }

    componentDidMount () {
      this.props.currentXRatio = null;
      this.props.currentYRatio = null;
    }

    handleInputEnd () {
      this.props.currentXRatio = this.props.currentYRatio = null;
      inputStop();
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
