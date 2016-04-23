import React from 'react'
import {size2, size4, width} from './constants'
import ModuleInput from './ModuleInput'

export default ({label, ...props}) => <ModuleInput {...{label}}>
  <input {...{
    style: {display: 'table-cell', height: size4, width},
    type: 'range',
    ...props,
  }} />
  <div {...{
    style: {
      display: 'table-cell',
      height: size4,
      paddingLeft: size2,
      minWidth: '2.25rem',
    },
  }}>{props.displayValue || props.defaultValue.toFixed(2)}</div>
</ModuleInput>
