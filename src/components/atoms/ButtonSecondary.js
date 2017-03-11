import {createElement, PropTypes} from 'react'
import {Link} from 'react-router'

const ButtonSecondary = ({children, to}) => createElement(
  Link,
  {className: 'ButtonSecondary', to},
  children
)

if (process.env.NODE_ENV !== 'production') {
  ButtonSecondary.propTypes = {
    children: PropTypes.string,
    to: PropTypes.string,
  }
}

export default ButtonSecondary
