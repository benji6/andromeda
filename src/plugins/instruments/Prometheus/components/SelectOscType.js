import {createElement} from 'react'
import {Select} from '../../../../components/organisms/ControlModule'

export default ({defaultValue, onChange}) => createElement(Select, {
  defaultValue,
  onChange,
  label: 'Type',
},
  createElement('option', {value: 'sawtooth'}, 'Sawtooth'),
  createElement('option', {value: 'sine'}, 'Sine'),
  createElement('option', {value: 'square'}, 'Square'),
  createElement('option', {value: 'triangle'}, 'Triangle')
)
