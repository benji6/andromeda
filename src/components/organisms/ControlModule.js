import {createElement} from 'react'

const Input = ({children, label}) =>
  createElement('label', {className: 'ControlModule__Input'},
    createElement('span', {className: 'ControlModule__Input__Label'}, label),
    children
  )

export const CheckBox = props => createElement(Input, {label: props.label},
  createElement('input', Object.assign({type: 'checkbox'}, props))
)

export const Range = props => {
  const max = props.max === undefined ? 1 : props.max
  const min = props.min === undefined ? 0 : props.min
  const step = props.step === undefined ? (max - min) / 1000 : props.step
  const displayValue = props.displayValue === undefined ? props.defaultValue.toFixed(2) : props.displayValue

  const inputProps = Object.assign({
    className: 'ControlModule__Range',
    max,
    min,
    step,
    type: 'range',
  }, props)

  delete inputProps.displayValue

  return createElement(Input, {label: props.label},
    createElement('input', inputProps),
    createElement('div', {className: 'ControlModule__Output'}, displayValue)
  )
}

export const Select = props => createElement(Input, {label: props.label},
  createElement('select', Object.assign({className: 'ControlModule__Select'}, props))
)

export default props => createElement('div', Object.assign({className: 'ControlModule'}, props),
  props.title && createElement('h3', {className: 'ControlModule__Title'}, props.title),
  createElement('div', {className: 'ControlModule__Container'}, props.children)
)
