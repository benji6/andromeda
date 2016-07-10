import {mapIndexed} from '../../utils/helpers'
import React from 'react'

export default ({options, ...props}) =>
  <select className='ButtonPrimary InputSelect' {...props}>
    {mapIndexed(({text, value}, i) =>
      <option value={value} key={i}>
        {text}
      </option>, options)}
  </select>
