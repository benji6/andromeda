/* global R */
import React from 'react'; // eslint-disable-line
import {updatePattern} from '../../actions';
import {mapIndexed} from '../../tools/indexedIterators';
import noteNameFromPitch from '../../tools/noteNameFromPitch';
import pitchFromScaleIndex from '../../tools/pitchFromScaleIndex';
const {range} = R;

const handleOnClick = (dispatch, pattern, i, j) =>
  dispatch(updatePattern(mapIndexed((row, x) => mapIndexed((cell, y) => x === i && y === j ?
                                      {...cell, selected: !cell.selected} :
                                      cell,
                                                           row),
                                    pattern)));

const selectedClass = ({selected}) => selected === true ? 'selected' : '';
const activeClass = ({active}) => active === true ? 'active' : '';

export default ({dispatch, pattern, scale, rootNote}) => {
  const patternLength = pattern[0].length;
  return <div className="pattern-editor">
    {[...mapIndexed((x, i) => <div className="label-x"
                                   key={`label-x-${i}`}>{x || ''}</div>,
                    range(0, patternLength + 1)),
      ...mapIndexed((x, i) => [<div className="label-y">{noteNameFromPitch(pitchFromScaleIndex(scale.scales[scale.scaleName],
                                                                                               patternLength - i - 1) + rootNote)}</div>,
                    ...mapIndexed((cell, j) =>
        <div className={`step ${selectedClass(cell)} ${activeClass(cell)}`}
             key={`cell-${i}-${j}`}
             onClick={() => handleOnClick(dispatch, pattern, i, j)} />, x)], pattern)]}
  </div>;
};
