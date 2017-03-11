import {createElement, PropTypes} from 'react'
import {Link} from 'react-router'

const HollowButton = ({children, to}) => createElement(Link, {
  activeClassName: 'HollowButton--active',
  className: 'HollowButton',
  to,
}, children)

HollowButton.propTypes = {
  children: PropTypes.string,
  to: PropTypes.string,
}

export default HollowButton
