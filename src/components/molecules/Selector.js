import capitalize from 'capitalize'
import React from 'react'
import InputLabel from '../atoms/InputLabel'
import InputSelect from '../atoms/InputSelect'

export default ({
  children,
  defaultValue,
  disabled,
  handleChange,
  label,
  options,
}) =>
  <div>
    <label className='selector'>
      <InputLabel>{capitalize(label)}</InputLabel>
      <InputSelect
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={handleChange}
        options={options}
      />
    </label>
    {children}
  </div>
