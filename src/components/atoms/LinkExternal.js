import {createElement, PropTypes} from 'react'

const LinkExternal = ({children, href}) => createElement('a', {
  children,
  className: 'LinkExternal',
  href,
  rel: 'noopener',
  target: '_blank',
})

LinkExternal.propTypes = {
  children: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
}

export default LinkExternal
