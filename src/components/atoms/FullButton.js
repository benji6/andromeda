import React from 'react'
import {Link} from 'react-router'
export default ({children, ...props}) => props.to
  ? <Link className='full-button' {...props}>{children}</Link>
  : <a className='full-button' href='#' {...props}>{children}</a>
