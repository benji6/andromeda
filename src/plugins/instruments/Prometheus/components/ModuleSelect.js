import React from 'react'
import {width} from './constants'
import _ModuleInput from './_ModuleInput'

export default ({label, ...props}) => <_ModuleInput {...{label}}>
  <select {...{display: 'table-cell', style: {width}, ...props}} />
</_ModuleInput>
