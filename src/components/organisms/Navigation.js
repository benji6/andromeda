import {createElement} from 'react'
import HollowButton from '../atoms/HollowButton'

export default () => createElement('nav', {className: 'Navigation'},
  createElement(HollowButton, {to: '/controllers/control-pad'}, 'Pad'),
  createElement(HollowButton, {to: '/controllers/song'}, 'Song'),
  createElement(HollowButton, {to: '/channels'}, 'FX'),
  createElement(HollowButton, {to: '/settings'}, 'Settings'),
  createElement(HollowButton, {to: '/about'}, '?'),
)
