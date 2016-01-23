import {mapIndexed} from '../../helpers'
import React from 'react'

export default ({options, ...props}) =>
  <select className='full-button full-select'
          {...props}>
    {mapIndexed(({text, value}, i) =>
      <option value={value} key={i}>
        {text}
      </option>, options)}
  </select>
