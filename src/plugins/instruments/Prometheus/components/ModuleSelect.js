import React from 'react'
import {width} from './constants'
import ModuleInput from './ModuleInput'

export default ({label, ...props}) => <ModuleInput {...{label}}>
  <select {...{display: 'table-cell', style: {width}, ...props}} />
</ModuleInput>
