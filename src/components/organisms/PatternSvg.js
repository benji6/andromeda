import {createElement} from 'react'
import {Link} from 'react-router'
import {makeClassName} from '../../utils/helpers'

export default ({steps, to, xLength, yLength, red}) => createElement(
  'div',
  {className: makeClassName(['PatternSvg', [red, 'PatternSvg--red']])},
  createElement(
    Link,
    {to},
    createElement(
      'svg',
      {width: 16 * xLength, height: 6 * yLength},
      steps.map(({x, y}) => createElement(
        'rect',
        {
          className: makeClassName(['PatternSvg__step', [red, 'PatternSvg__step--red']]),
          height: 5,
          key: `${x}${y}`,
          width: 15,
          x: x * 15,
          y: y * 5,
        }
      ))
    )
  )
)
