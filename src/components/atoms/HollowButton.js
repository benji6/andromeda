import {createElement} from 'react'
import {Link} from 'react-router'

export default ({children, ...props}) => createElement(Link, {
  ...props,
  activeClassName: 'HollowButton--active',
  className: 'HollowButton',
}, children)
