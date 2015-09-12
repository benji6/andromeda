/* global R */
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import {updatePattern} from '../../actions';
import mapIndexed from '../../tools/mapIndexed';
import PlayButton from '../atoms/PlayButton';
import Navigation from '../organisms/Navigation';

const {identity} = R;

const handleOnClick = (dispatch, pattern, i, j) => () =>
  dispatch(updatePattern(mapIndexed((row, x) => mapIndexed((cell, y) => x === i && y === j ? !cell : cell,
                                                           row),
                                    pattern)));

export default connect(identity)(({dispatch, pattern}) =>
  <div>
    <Navigation />
    <div className="pattern-editor">
      {pattern.map((x, i) =>
        x.map((y, j) =>
          <div
            className={y === false ? 'step' : 'step selected'}
            key={`${i}-${j}`}
            onClick={handleOnClick(dispatch, pattern, i, j)}
          />))}
    </div>
    <PlayButton />
  </div>);
