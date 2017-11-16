import {createElement, PropTypes} from 'react'

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
}, options.map(({text, value}, i) => createElement('option', {key: i, value}, text)))

InputSelect.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
}

export default InputSelect
