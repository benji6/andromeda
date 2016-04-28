import React from 'react'

const Input = ({children, label}) =>
  <label {...{className: 'ControlModule__Input'}}>
    <span {...{className: 'ControlModule__Input__Label'}}>{label}</span>
    {children}
  </label>

export const Range = ({label, ...props}) => <Input {...{label}}>
  <input {...{
    className: 'ControlModule__Range',
    type: 'range',
    ...props,
  }} />
  <div {...{className: 'ControlModule__Output'}}>
    {props.displayValue || props.defaultValue.toFixed(2)}
  </div>
</Input>

export const Select = ({label, ...props}) => <Input {...{label}}>
  <select {...{className: 'ControlModule__Select', ...props}} />
</Input>

export default ({children, title, ...props}) => <div {...{
  className: 'ControlModule',
  ...props,
}}>
  {title ? <h3 {...{className: 'ControlModule__Title'}}>{title}</h3> : null}
  <div {...{className: 'display-table'}}>{children}</div>
</div>
