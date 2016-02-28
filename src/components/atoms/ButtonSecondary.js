import React from 'react'
import {Link} from 'react-router'

export default ({children, ...props}) =>
  <Link className='button-secondary' {...props}>{children}</Link>
