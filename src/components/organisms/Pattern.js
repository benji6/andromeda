import {range} from 'ramda'
import {mapIndexed} from '../../utils/helpers'
import React from 'react'
import XLabels from '../molecules/XLabels'
import PatternRow from '../molecules/PatternRow'

export default class extends React.Component {
  componentDidMount () {
    const patternBody = document.querySelector('.Pattern_body')
    patternBody.scrollTop = patternBody.clientHeight
  }
  render () {
    const {onClick, patternData, yLabel} = this.props
    return <div className='Pattern'>
      <XLabels labels={range(0, patternData[0].length + 1)} />
      <div className='Pattern_body'>
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
    </div>
  }
}
