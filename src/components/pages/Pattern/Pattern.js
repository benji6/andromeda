import {range} from 'ramda'
import {Component, createElement} from 'react'
import {mapIndexed} from '../../../utils/helpers'
import XLabels from '../../molecules/XLabels'
import PatternRow from '../../molecules/PatternRow'
import Marker from './Marker'

export default class extends Component {
  componentDidMount () {
    const patternBody = this.refs.Pattern_Body
    patternBody.scrollTop = patternBody.clientHeight
  }
  render () {
    const {
      height,
      markerPosition,
      onClick,
      patternData,
      red,
      width,
      yLabel,
    } = this.props
    const xLength = patternData[0].length + 1
    const markerLeft = 1 / xLength
    const scrollBarWidthFactor = 0.02

    return createElement('div', {className: 'Pattern__Container'},
      createElement(Marker, {
        height,
        markerPosition: markerPosition * (1 - markerLeft - scrollBarWidthFactor) + markerLeft,
        red,
        width,
      }),
      createElement(XLabels, {labels: range(0, xLength)}),
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
