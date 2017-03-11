import {createElement, PropTypes} from 'react'
import {Link} from 'react-router'

const HollowButton = ({children, to}) => createElement(Link, {
  activeClassName: 'HollowButton--active',
  className: 'HollowButton',
  to,
}, children)

if (process.env.NODE_ENV !== 'production') {
  HollowButton.propTypes = {
    children: PropTypes.string,
    to: PropTypes.string,
  }
}

export default HollowButton
