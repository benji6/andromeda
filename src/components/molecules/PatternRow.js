import {createElement} from 'react'
import {mapIndexed} from '../../utils/helpers'
import Step from '../atoms/Step'

export default ({cells, onClick, red, yLabel}) =>
  createElement('div', {className: 'PatternRow'}, [
    createElement('div', {className: 'YLabel', key: 'YLabel'}, yLabel),
    mapIndexed((cell, i) => createElement(Step, {
      key: i,
      onClick: onClick(i),
      red,
      selected: cell.selected,
    }), cells)
  ])
