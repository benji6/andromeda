import {createElement} from 'react';
import {Link} from 'react-router'

export default ({steps, to, xLength, yLength}) => createElement(
  'div',
  {className: 'PatternSvg'},
  createElement(
    Link,
    {to},
    createElement(
      'svg',
      {width: 16 * xLength, height: 6 * yLength},
      steps.map(({x, y}) => createElement(
        'rect',
        {
          className: 'PatternSvg__step',
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
