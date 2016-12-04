import {createElement, PropTypes} from 'react'

const InputLabel = ({children}) => createElement('div', {className: 'InputLabel'},
  children,
)

if (process.env.NODE_ENV !== 'production') {
  InputLabel.propTypes = {
    children: PropTypes.string,
  }
}

export default InputLabel
