import React from 'react'
import {Link} from 'react-router'
export default ({text, ...props}) => <Link className='hollow-button'
                                           {...props}>{text}</Link>
