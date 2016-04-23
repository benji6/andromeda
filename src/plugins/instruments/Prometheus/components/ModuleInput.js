import React from 'react'
import {size4, size3, size2} from './constants'

export default ({children, label}) => <label {...{
  style: {
    display: 'table-row',
    fontSize: size4,
    padding: size4,
  }
}}>
  <span {...{
    style: {
      display: 'table-cell',
      padding: `${size3} ${size3} ${size2} ${size2}`,
      textAlign: 'left',
    }
  }}>{label}</span>
  {children}
</label>
