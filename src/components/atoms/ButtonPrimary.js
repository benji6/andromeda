import {createElement} from 'react'
import {Link} from 'react-router'
import {makeClassName} from '../../utils/dom'

export default ({children, red, small, ...props}) => {
  const className = makeClassName(
    'ButtonPrimary',
    red && 'ButtonPrimary--red',
    small && 'ButtonPrimary--small',
  )
  return props.to
    ? createElement(
      Link,
      {className, ...props},
      children
    )
    : createElement(
      'a',
      {className, href: '#', ...props},
      children
    )
}
