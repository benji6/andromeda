import React from 'react'

module.exports = ({checked, ...props}) =>
  <input
    className='Checkbox'
    defaultChecked={checked}
    type='Checkbox'
    {...props}
  />
