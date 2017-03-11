import {createElement, PropTypes} from 'react'
import {Link} from 'react-router'
import {makeClassName} from '../../utils/dom'

const ButtonPrimary = ({children, onClick, small, to}) => {
  const className = makeClassName(
    'ButtonPrimary',
    small && 'ButtonPrimary--small',
  )
  return to
    ? createElement(Link, {className, to}, children)
    : createElement('a', {className, href: '#', onClick}, children)
}

if (process.env.NODE_ENV !== 'production') {
  ButtonPrimary.propTypes = {
    children: PropTypes.string,
    onClick: PropTypes.func,
    small: PropTypes.bool,
    to: PropTypes.string,
  }
}

export default ButtonPrimary
