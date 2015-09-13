import React from 'react'; // eslint-disable-line
import {updatePattern} from '../../actions';
import mapIndexed from '../../tools/mapIndexed';

const handleOnClick = (dispatch, pattern, i, j) =>
  dispatch(updatePattern(mapIndexed((row, x) => mapIndexed((cell, y) => x === i && y === j ?
                                      {...cell, selected: !cell.selected} :
                                      cell,
                                                           row),
                                    pattern)));

const selectedClass = ({selected}) => selected === true ? 'selected' : '';
const activeClass = ({active}) => active === true ? 'active' : '';

export default ({dispatch, pattern}) =>
    <div className="pattern-editor">
      {pattern.map((x, i) =>
        x.map((cell, j) =>
          <div className={`step ${selectedClass(cell)} ${activeClass(cell)}`}
               key={`${i}-${j}`}
               onClick={() => handleOnClick(dispatch, pattern, i, j)} />))}
    </div>;
