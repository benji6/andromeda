import React from 'react'
import {blue, size0, size1, size4, size5} from './constants'

export default ({children, title, ...props}) => <div {...{
  style: {
    border: `${size1} solid ${blue}`,
    borderRadius: size5,
    display: 'inline-block',
    margin: size4,
    padding: size4,
  },
  ...props,
}}>
  {title ? <h3 {...{style: {
    fontSize: size5,
    fontWeight: '600',
    margin: size0,
    paddingBottom: size4,
  }}}>{title}</h3> : null}
  <div {...{style: {display: 'table'}}}>{children}</div>
</div>
