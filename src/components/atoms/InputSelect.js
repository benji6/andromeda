import {createElement, PropTypes} from 'react'
import {mapIndexed} from '../../utils/helpers'

const InputSelect = ({
  disabled,
  onChange,
  options,
  value,
}) => createElement('select', {
  className: 'ButtonPrimary InputSelect',
  disabled,
  onChange,
  value,
}, mapIndexed(
  ({text, value}, i) => createElement('option', {key: i, value}, text),
  options
))

if (process.env.NODE_ENV !== 'production') {
  InputSelect.propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
  }
}

export default InputSelect
