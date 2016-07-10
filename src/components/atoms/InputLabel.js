import {createElement} from 'react'

export default ({children}) => createElement(
  'div',
  {className: 'InputLabel'},
  children,
)
