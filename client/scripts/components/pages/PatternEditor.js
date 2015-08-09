/* global R */
import React from 'react';
// import render from '../tools/render';
const {addIndex, curry, map} = R;

const mapIndexed = addIndex(map);

const patternModel = map(() => Array.apply(0, {length:8}), Array.apply(0, {length:8}));

const handleOnClick = curry((i, j, e) => console.log(i, j, e));

export default class PatternEditor extends React.Component {
  render () {
    return (
      <div className="pattern-editor">
        {mapIndexed((x, i) => mapIndexed((y, j) => <div className="step"
                                                        key={`${i}-${j}`}
                                                        onClick={handleOnClick(i, j)}></div>,
                                         x),
                    patternModel)}
      </div>
    );
  }
}
