import React from 'react'
import {Link} from 'react-router'

export default ({text, ...props}) =>
  <Link {...{...props, className: 'hollow-button'}}>{text}</Link>
