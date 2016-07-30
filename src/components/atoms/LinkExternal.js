import {createElement} from 'react'

export default ({children, href}) => createElement('a', {
  children,
  className: 'LinkExternal',
  href,
  rel: 'noopener',
  target: '_blank',
})
