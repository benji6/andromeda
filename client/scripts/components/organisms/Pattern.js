import {map, range} from 'ramda';
import React from 'react'; // eslint-disable-line
import XLabels from '../molecules/XLabels';
import PatternRow from '../molecules/PatternRow';

export default ({handleClick, notes, yLabel, xLength, yLength}) =>
  <div className="pattern-editor">
    <XLabels labels={range(0, xLength + 1)} />
    {map(x => <PatternRow cells={range(0, xLength)}
                          key={`pattern-row-${x}`}
                          onClick={handleClick(x)}
                          rowIndex={x}
                          yLabel={yLabel(x)} />,
         range(0, yLength))}
  </div>;
