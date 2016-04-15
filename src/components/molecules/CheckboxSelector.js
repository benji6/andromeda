import React from 'react'
import Checkbox from '../atoms/Checkbox'
import InputLabel from '../atoms/InputLabel'

export default ({text, ...props}) =>
  <label className='selector'>
    <InputLabel>{text}</InputLabel>
    <Checkbox {...props} />
  </label>
