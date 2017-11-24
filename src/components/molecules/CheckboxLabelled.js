import {PropTypes} from 'prop-types'
import {createElement} from 'react'
import InputLabel from '../atoms/InputLabel'

const CheckboxLabelled = ({checked, onChange, children}) => createElement('label', null,
  createElement(InputLabel, null, children),
  createElement('div', {className: 'CheckboxLabelled__Checkbox'},
    createElement('input', {
      defaultChecked: checked,
      onChange,
      type: 'checkbox',
    })
  )
)

CheckboxLabelled.propTypes = {
  checked: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default CheckboxLabelled
