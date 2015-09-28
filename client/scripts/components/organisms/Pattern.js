import React from 'react'; // eslint-disable-line
import {updateActivePatternNotes} from '../../actions';
import {mapIndexed} from '../../tools/indexedIterators';
import noteNameFromPitch from '../../tools/noteNameFromPitch';
import pitchFromScaleIndex from '../../tools/pitchFromScaleIndex';
import {range} from 'ramda';

const handleOnClick = (dispatch, notes, i, j) =>
  dispatch(updateActivePatternNotes(mapIndexed((row, x) => mapIndexed((cell, y) => x === i && y === j ?
                                      {...cell, selected: !cell.selected} :
                                      cell,
                                                           row),
                                    notes)));

const selectedClass = ({selected}) => selected === true ? 'selected' : '';
const activeClass = ({active}) => active === true ? 'active' : '';

export default ({dispatch, notes, scale, rootNote}) => {
  const notesLength = notes[0].length;
  return <div className="pattern-editor">
    {[...mapIndexed((x, i) => <div className="label-x"
                                   key={`label-x-${i}`}>{x || ''}</div>,
                    range(0, notesLength + 1)),
      ...mapIndexed((x, i) => [<div className="label-y">{noteNameFromPitch(pitchFromScaleIndex(scale.scales[scale.scaleName],
                                                                                               notesLength - i - 1) + rootNote)}</div>,
                    ...mapIndexed((cell, j) =>
        <div className={`step ${selectedClass(cell)} ${activeClass(cell)}`}
             key={`cell-${i}-${j}`}
             onClick={() => handleOnClick(dispatch, notes, i, j)} />, x)], notes)]}
  </div>;
};
