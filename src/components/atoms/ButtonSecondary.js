import React from 'react'
import {Link} from 'react-router'

export default ({children, ...props}) =>
  <Link className='ButtonSecondary' {...props}>{children}</Link>
