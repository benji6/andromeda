import React from 'react'
import {
  blue,
  size0,
  size1,
  size2,
  size3,
  size4,
  size5,
  width,
} from './constants'

const Input = ({children, label}) => <label {...{
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

export const Range = ({label, ...props}) => <Input {...{label}}>
  <input {...{
    style: {display: 'table-cell', height: size4, width},
    type: 'range',
    ...props,
  }} />
  <div {...{
    style: {
      display: 'table-cell',
      height: size4,
      paddingLeft: size2,
      minWidth: '2.25rem',
    },
  }}>{props.displayValue || props.defaultValue.toFixed(2)}</div>
</Input>

export const Select = ({label, ...props}) => <Input {...{label}}>
  <select {...{display: 'table-cell', style: {width}, ...props}} />
</Input>

export default ({children, title, ...props}) => <div {...{
  style: {
    border: `${size1} solid ${blue}`,
    borderRadius: size5,
    display: 'inline-block',
    margin: size4,
    padding: size4,
  },
  ...props,
}}>
  {title ? <h3 {...{style: {
    fontSize: size5,
    fontWeight: '600',
    margin: size0,
    paddingBottom: size4,
  }}}>{title}</h3> : null}
  <div {...{style: {display: 'table'}}}>{children}</div>
</div>
