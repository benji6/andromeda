import React from 'react'
import {Select} from './Module'

export default ({defaultValue, onChange}) => <Select {...{
  defaultValue,
  onChange,
  label: 'Type',
}}>
  <option value='sawtooth'>Sawtooth</option>
  <option value='sine'>Sine</option>
  <option value='square'>Square</option>
  <option value='triangle'>Triangle</option>
</Select>
