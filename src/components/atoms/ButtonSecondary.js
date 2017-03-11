import {createElement, PropTypes} from 'react'
import {Link} from 'react-router'

const ButtonSecondary = ({children, to}) => createElement(
  Link,
  {className: 'ButtonSecondary', to},
  children
)

ButtonSecondary.propTypes = {
  children: PropTypes.string,
  to: PropTypes.string,
}

export default ButtonSecondary
