import {createElement, PropTypes} from 'react'

const WelcomeMessage = ({children}) => createElement('div', {
  children,
  className: 'WelcomeMessage fade-out',
})

if (process.env.NODE_ENV !== 'production') {
  WelcomeMessage.propTypes = {
    children: PropTypes.string.isRequired,
  }
}

export default WelcomeMessage
