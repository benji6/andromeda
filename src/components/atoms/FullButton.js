import React from 'react'
import {Link} from 'react-router'
export default ({text, ...props}) =>
  <Link className='full-button' {...props}>{text}</Link>
