import {createElement} from 'react'

export default ({children}) => createElement('div', {
  children,
  className: 'WelcomeMessage fade-out',
})
