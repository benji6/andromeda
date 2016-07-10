import {createElement} from 'react'
import {Link} from 'react-router'

export default ({children, ...props}) => createElement(
  Link,
  {className: 'ButtonSecondary', ...props},
  children
)
