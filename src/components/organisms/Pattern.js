import {range} from 'ramda'
import {mapIndexed} from '../../utils/helpers'
import React from 'react'
import XLabels from '../molecules/XLabels'
import PatternRow from '../molecules/PatternRow'

export default ({onClick, patternData, yLabel}) =>
  <div className='pattern'>
    <XLabels labels={range(0, patternData[0].length + 1)} />
    {mapIndexed(
      (rowData, i) => <PatternRow
        cells={rowData}
        key={`pattern-row-${i}`}
        onClick={onClick(i)}
        yLabel={yLabel(i)}
      />,
      patternData
    )}
  </div>
