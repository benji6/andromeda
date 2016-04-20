import React from 'react'

export default ({children, title, ...props}) => <div {...{
  style: {display: 'inline-block', padding: '1rem 1rem 0 1rem'},
  ...props,
}}>
  {title ? <h3>{title}</h3> : null}
  <div {...{style: {display: 'table'}}}>{children}</div>
</div>
