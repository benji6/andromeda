import React from 'react'

const createButton = (modifier, text) => ({children, ...props}) =>
  <button className={`icon-button icon-button--${modifier}`} {...props}>
    {text} <span className={'font-size-1'}>{children}</span>
  </button>

export const Cross = createButton('red-hover', 'x')
export const Down = createButton('blue-hover', '\u2193')
export const Plus = createButton('green-hover', '+')
export const Up = createButton('blue-hover', '\u2191')
