import {createElement} from 'react'

const createButton = (modifier, text) => ({children, ...props}) => createElement(
  'button',
  {...props, className: `ButtonIcon ButtonIcon--${modifier}`},
  text,
  ' ',
  createElement('span', {className: 'ButtonIcon__Label'}, children)
)

export const Cross = createButton('red-hover', 'x')
export const Down = createButton('blue-hover', '\u2193')
export const Plus = createButton('green-hover', '+')
export const Up = createButton('blue-hover', '\u2191')
