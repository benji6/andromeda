import React from 'react'; // eslint-disable-line
import {mapIndexed} from '../../tools/indexedIterators';
import {range} from 'ramda';

const selectedClass = ({selected}) => selected === true ? 'selected' : '';
const activeClass = ({active}) => active === true ? 'active' : '';

export default ({handleClick, notes, yLabel}) => {
  const notesLength = notes[0].length;
  return <div className="pattern-editor">
    {[...mapIndexed((x, i) => <div className="label-x"
                                   key={`label-x-${i}`}>{x || ''}</div>,
                    range(0, notesLength + 1)),
      ...mapIndexed((x, i) => [<div className="label-y">{yLabel(i)}</div>,
                    ...mapIndexed((cell, j) =>
        <div className={`step ${selectedClass(cell)} ${activeClass(cell)}`}
             key={`cell-${i}-${j}`}
             onClick={handleClick.bind(null, i, j)} />, x)], notes)]}
  </div>;
};
