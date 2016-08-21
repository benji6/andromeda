import {createElement} from 'react'

const Input = ({children, label}) =>
  createElement('label', {className: 'ControlModule__Input'},
    createElement('span', {className: 'ControlModule__Input__Label'}, label),
    children
  )

export const CheckBox = ({label, ...props}) =>
  createElement(Input, {label},
    createElement('input', {type: 'checkbox', ...props})
  )

export const Range = ({
  label,
  max = 1,
  min = 0,
  step = (max - min) / 1000,
  ...props,
}) =>
  createElement(Input, {label},
    createElement('input', {
      className: 'ControlModule__Range',
      max,
      min,
      step,
      type: 'range',
      ...props,
    }),
    createElement('div', {className: 'ControlModule__Output'},
      props.displayValue || props.defaultValue.toFixed(2)
    )
  )

export const Select = ({label, ...props}) =>
  createElement(Input, {label},
    createElement('select', {className: 'ControlModule__Select', ...props})
  )

export default ({children, title, ...props}) =>
  createElement('div', {className: 'ControlModule', ...props},
    title && createElement('h3', {className: 'ControlModule__Title'}, title),
    createElement('div', {className: 'ControlModule__Container'}, children)
  )
