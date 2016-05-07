import React from 'react'
import {Link} from 'react-router'

export default ({children, ...props}) => props.to
  ? <Link className='button-primary' {...props}>{children}</Link>
  : <a className='button-primary' href='#' {...props}>{children}</a>
