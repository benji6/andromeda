import {createElement} from 'react'

export default ({children}) => createElement('div', {
  className: 'WelcomeMessage fade-out',
  children,
})
