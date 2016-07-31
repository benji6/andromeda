import {createElement} from 'react'
import {Link} from 'react-router'
import {makeClassName} from '../../utils/helpers'

const cellHeight = 6
const cellWidth = 16

export default ({steps, to, xLength, yLength, red}) => createElement(
  'div',
  {className: makeClassName('PatternSvg', [red, 'PatternSvg--red'])},
  createElement(
    Link,
    {to},
    createElement(
      'svg',
      {width: xLength * cellWidth, height: yLength * cellHeight},
      steps.map(({x, y}) => createElement(
        'rect',
        {
          className: makeClassName('PatternSvg__step', [red, 'PatternSvg__step--red']),
          height: cellHeight,
          key: `${x}${y}`,
          width: cellWidth,
          x: x * cellWidth,
          y: y * cellHeight,
        }
      ))
    )
  )
)
