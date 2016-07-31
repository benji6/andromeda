import {createElement} from 'react'
import {mapIndexed} from '../../utils/helpers'

export default ({labels}) =>
  createElement('div', {className: 'XLabels flex-row'},
    mapIndexed((label, i) => createElement(
      'div',
      {className: 'XLabel', key: `XLabel-${i}`},
      i ? label : ''
    ), labels),
    createElement('div', {style: {width: '8rem'}})
  )
