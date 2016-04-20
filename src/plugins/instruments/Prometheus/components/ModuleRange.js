import React from 'react'
import {height, width} from './constants'
import _ModuleInput from './_ModuleInput'

export default ({label, ...props}) => <_ModuleInput {...{label}}>
  <input {...{
    style: {display: 'table-cell', height, width},
    type: 'range',
    ...props,
  }} />
</_ModuleInput>
