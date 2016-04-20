import React from 'react'
import {height, padding} from './constants'

export default ({children, label}) => <label {...{
  style: {
    display: 'table-row',
    fontSize: height,
    padding,
  }
}}>
  <span {...{
    style: {
      display: 'table-cell',
      paddingBottom: '0.5rem',
      paddingRight: '0.5rem',
      textAlign: 'left',
    }
  }}>{label}</span>
  {children}
</label>
