import React from 'react'
import {Link} from 'react-router'

export default ({children, ...props}) =>
  <Link {...{
    ...props,
    activeClassName: 'HollowButton--active',
    className: 'HollowButton'
  }}>{children}</Link>
