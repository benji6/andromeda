import React from 'react'

export default ({children, ...props}) => <div {...props}>
  <label>
    {children}
  </label>
</div>
