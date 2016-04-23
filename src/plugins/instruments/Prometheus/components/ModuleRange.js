import React from 'react'
import {height, width} from './constants'
import _ModuleInput from './_ModuleInput'

export default ({label, ...props}) => <_ModuleInput {...{label}}>
  <input {...{
    style: {display: 'table-cell', height, width},
    type: 'range',
    ...props,
  }} />
  <div {...{
    style: {
      display: 'table-cell',
      height,
      paddingLeft: '0.25rem',
      minWidth: '2.25rem'
    },
  }}>{props.displayValue || props.defaultValue.toFixed(2)}</div>
</_ModuleInput>
