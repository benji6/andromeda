import React from 'react'
import {width} from './constants'
import _ModuleInput from './_ModuleInput'
import {height} from './constants'

export default ({label, ...props}) => <_ModuleInput {...{label}}>
  <input {...{
    style: {display: 'table-cell', height, width},
    type: 'range',
    ...props,
  }} />
</_ModuleInput>
