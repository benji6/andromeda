import React from 'react'
import {Link} from 'react-router'
export default ({children, ...props}) =>
  <Link className='full-button' {...props}>{children}</Link>
