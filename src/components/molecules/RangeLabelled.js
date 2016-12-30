import {createElement, PropTypes} from 'react'
import InputLabel from '../atoms/InputLabel'

const RangeLabelled = ({children, output, ...props}) => createElement('label', null,
  createElement(InputLabel, null, children),
  createElement('div', {className: 'RangeLabelled__Container'},
    createElement('div', null,
      createElement('output', null,
        props.disabled ? createElement('span', null, ' ') : output
      )
    ),
    createElement('input', {...props, className: 'RangeLabelled__Input', type: 'range'})
  )
)

if (process.env.NODE_ENV !== 'production') {
  RangeLabelled.propTypes = {
    children: PropTypes.string.isRequired,
    max: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    output: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    step: PropTypes.number,
    value: PropTypes.number.isRequired,
  }
}

export default RangeLabelled
