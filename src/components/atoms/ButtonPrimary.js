import {createElement} from 'react'
import {Link} from 'react-router'
import {makeClassName} from '../../utils/helpers'

export default ({children, red, small, ...props}) => {
  const className = makeClassName(
    'ButtonPrimary',
    [red, 'ButtonPrimary--red'],
    [small, 'ButtonPrimary--small'],
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
