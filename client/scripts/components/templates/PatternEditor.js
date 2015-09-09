/* global R */
import React from 'react';
import {connect} from 'react-redux';
import {updatePattern} from '../../actions';
import mapIndexed from '../../tools/mapIndexed';

const {identity} = R;

const handleOnClick = (dispatch, pattern, i, j) => () =>
  dispatch(updatePattern(mapIndexed((row, x) => mapIndexed((cell, y) => x === i && y === j ? !cell : cell,
                                                           row),
                                    pattern)));
@connect(identity)
export default class PatternEditor extends React.Component {
  render () {
    const {dispatch, pattern} = this.props;
    return (
      <div className="pattern-editor">
        {pattern.map((x, i) =>
          x.map((y, j) =>
            <div
              className={y === false ? 'step' : 'step selected'}
              key={`${i}-${j}`}
              onClick={handleOnClick(dispatch, pattern, i, j)}
            />))}
      </div>
    );
  }
}
