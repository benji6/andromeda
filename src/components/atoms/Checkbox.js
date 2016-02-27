import React from 'react'

module.exports = ({checked, ...props}) =>
  <input
    className='checkbox'
    defaultChecked={checked}
    type='checkbox'
    {...props}
  />
