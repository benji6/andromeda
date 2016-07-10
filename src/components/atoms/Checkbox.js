import {createElement} from 'react'

module.exports = ({checked, ...props}) => createElement('input', {
  ...props,
  className: 'Checkbox',
  defaultChecked: checked,
  type: 'Checkbox',
})
