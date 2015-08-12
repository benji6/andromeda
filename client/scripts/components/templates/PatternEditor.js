/* global R */
import React from 'react';
import {connect} from 'react-redux';

const {curry} = R;

const handleOnClick = curry((i, j, e) => console.log(i, j, e));

@connect(x => x)
export default class PatternEditor extends React.Component {
  render () {
    const {pattern} = this.props;
    console.log(pattern);
    return (
      <div className="pattern-editor">
        {pattern.map((x, i) =>
          x.map((y, j) =>
            <div
              className="step"
              key={`${i}-${j}`}
              onClick={handleOnClick(i, j)}
            />))}
      </div>
    );
  }
}
