import {range} from 'ramda'
import {Component, createElement} from 'react'
import {makeClassName, mapIndexed} from '../../../utils/helpers'
import XLabels from '../../molecules/XLabels'
import PatternRow from '../../molecules/PatternRow'

export default class extends Component {
  componentDidMount () {
    const patternBody = this.refs.Pattern_Body
    patternBody.scrollTop = patternBody.clientHeight
  }
  render () {
    const {markerPosition, onClick, patternData, red, yLabel} = this.props
    const markerLeft = 100 / (patternData[0].length + 1)
    return createElement('div', {className: 'Pattern__Container'},
      createElement('div', {
        className: makeClassName('Pattern__Marker', red && 'Pattern__Marker--pink'),
        style: {
          transform: `translateX(${markerLeft + (100 - markerLeft - 0.9) * markerPosition - 0.3}vw)`,
        },
      }),
      createElement(XLabels, {labels: range(0, patternData[0].length + 1)}),
      createElement('div', {className: 'Pattern_Body', ref: 'Pattern_Body'},
        mapIndexed(
          (rowData, i) => createElement(PatternRow, {
            cells: rowData,
            key: `PatternRow-${i}`,
            onClick: onClick(i),
            red,
            yLabel: yLabel(i),
          }),
          patternData
        )
      )
    )
  }
}
