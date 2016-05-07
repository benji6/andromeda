import React from 'react'

const Input = ({children, label}) =>
  <label {...{className: 'control-module__Input'}}>
    <span {...{className: 'control-module__Input__Label'}}>{label}</span>
    {children}
  </label>

export const Range = ({label, ...props}) => <Input {...{label}}>
  <input {...{
    className: 'control-module__Range',
    type: 'range',
    ...props,
  }} />
  <div {...{className: 'control-module__Output'}}>
    {props.displayValue || props.defaultValue.toFixed(2)}
  </div>
</Input>

export const Select = ({label, ...props}) => <Input {...{label}}>
  <select {...{className: 'control-module__Select', ...props}} />
</Input>

export default ({children, title, ...props}) => <div {...{
  className: 'control-module',
  ...props,
}}>
  {title ? <h3 {...{className: 'control-module__Title'}}>{title}</h3> : null}
  <div {...{className: 'display-table'}}>{children}</div>
</div>
