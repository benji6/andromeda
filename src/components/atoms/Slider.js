import {createElement} from 'react'

export default ({output, ...props}) => createElement(
  'div',
  {className: 'Slider'},
  createElement(
    'div',
    null,
    createElement(
      'output',
      null,
      props.disabled ? createElement('span', null, ' ') : output
    )
  ),
  createElement('input', {...props, className: 'Slider__Input', type: 'range'})
)
