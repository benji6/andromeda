import {range} from 'ramda'
import {mapIndexed} from '../../utils/helpers'
import React from 'react'
import XLabels from '../molecules/XLabels'
import PatternRow from '../molecules/PatternRow'
import {makeClassName} from '../../utils/helpers'

export default class extends React.Component {
  componentDidMount () {
    const patternBody = this.refs.pattern__body
    patternBody.scrollTop = patternBody.clientHeight
  }
  render () {
    const {markerPosition, onClick, patternData, red, yLabel} = this.props
    const markerLeft = 100 / (patternData[0].length + 1)
    return <div className='pattern'>
      <div {...{
        className: makeClassName(['pattern__marker', [red, 'pattern__marker--pink']]),
        style: {
          transform: `translateX(${markerLeft + (100 - markerLeft - 0.9) * markerPosition - 0.3}vw)`,
        },
      }}/>
      <XLabels labels={range(0, patternData[0].length + 1)} />
      <div {...{className: 'pattern__body', ref: 'pattern__body'}}>
        {mapIndexed(
          (rowData, i) => <PatternRow {...{
            cells: rowData,
            key: `PatternRow-${i}`,
            onClick: onClick(i),
            red,
            yLabel: yLabel(i),
          }}/>,
          patternData
        )}
      </div>
    </div>
  }
}
