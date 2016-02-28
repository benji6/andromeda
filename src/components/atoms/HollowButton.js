import React from 'react'
import {Link} from 'react-router'

export default ({children, ...props}) =>
  <Link {...{
    ...props,
    activeClassName: 'hollow-button--active',
    className: 'hollow-button'
  }}>{children}</Link>
