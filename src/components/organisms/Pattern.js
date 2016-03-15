import {pluck, range} from 'ramda'
import {mapIndexed} from '../../utils/helpers'
import React from 'react'
import XLabels from '../molecules/XLabels'
import PatternRow from '../molecules/PatternRow'

export default ({onClick, yLabel, patternData}) =>
  <div className='pattern'>
    <XLabels labels={range(0, patternData[0].length + 1)} />
    {mapIndexed(
      (_, i) => <PatternRow
        cells={pluck(i, patternData)}
        key={`pattern-row-${i}`}
        onClick={onClick(i)}
        yLabel={yLabel(i)}
      />,
      patternData
    )}
  </div>
