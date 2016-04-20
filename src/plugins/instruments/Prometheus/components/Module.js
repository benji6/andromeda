import React from 'react'
import {height} from './constants'

export default ({children, title, ...props}) => <div {...{
  style: {display: 'inline-block', padding: '1rem 1rem 0 1rem'},
  ...props,
}}>
  {title ? <h3 {...{style: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0rem',
    paddingBottom: height,
  }}}>{title}</h3> : null}
  <div {...{style: {display: 'table'}}}>{children}</div>
</div>
