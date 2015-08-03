import React from 'react';
import render from '../tools/render';
import {addIndex, curry, map} from 'ramda';

const mapIndexed = addIndex(map);

const patternModel = map(x => Array.apply(0, {length:8}), Array.apply(0, {length:8}));

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
