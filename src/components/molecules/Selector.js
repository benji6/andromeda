import capitalize from 'capitalize'
import {createElement} from 'react'
import InputLabel from '../atoms/InputLabel'
import InputSelect from '../atoms/InputSelect'

export default ({
  children,
  defaultValue,
  disabled,
  handleChange,
  label,
  options,
}) =>
  createElement('div', null,
    createElement('label', null,
      createElement(InputLabel, null, capitalize(label)),
      createElement(
        InputSelect,
        {defaultValue, disabled, onChange: handleChange, options}
      )
    ),
    children
  )
