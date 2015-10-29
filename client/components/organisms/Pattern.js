import {range} from 'ramda';
import {mapIndexed} from '../../tools/indexedIterators';
import React from 'react';
import XLabels from '../molecules/XLabels';
import PatternRow from '../molecules/PatternRow';

export default ({onClick, yLabel, patternData}) =>
  <div className="pattern">
    <XLabels labels={range(0, patternData[0].length + 1)} />
    {mapIndexed((cells, i) => <PatternRow cells={cells}
                                          key={`pattern-row-${i}`}
                                          onClick={onClick(i)}
                                          rowIndex={i}
                                          yLabel={yLabel(i)} />,
                patternData)}
  </div>;
