import {createElement} from 'react';
import {Link} from 'react-router'

export default ({steps, to}) => createElement(
  'div',
  {className: 'PatternSvg'},
  createElement(
    Link,
    {to},
    createElement(
      'svg',
      {width: 240, height: 80},
      steps.map(({x, y}) => createElement(
        'rect',
        {
          fill: 'blue',
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
