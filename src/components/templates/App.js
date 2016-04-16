import React from 'react'
import Navigation from '../organisms/Navigation'
import {version} from '../../../package'
import WelcomeMessage from '../atoms/WelcomeMessage'

export default ({children}) =>
  <div>
    <WelcomeMessage>{`v${version}`}</WelcomeMessage>
    <Navigation />
    {children}
  </div>
