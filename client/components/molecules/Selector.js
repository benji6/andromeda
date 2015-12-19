import capitalize from 'capitalize'
import React from 'react'
import InputLabel from '../atoms/InputLabel'
import FullSelect from '../atoms/FullSelect'

export default ({defaultValue,
                 handleChange,
                 label,
                 options}) =>
  <label className='selector'>
    <InputLabel text={capitalize(label)} />
    <FullSelect defaultValue={defaultValue}
                onChange={handleChange}
                options={options} />
  </label>
