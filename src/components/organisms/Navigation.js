import React from 'react'
import HollowButton from '../atoms/HollowButton'

export default () =>
  <nav className='navigation'>
    <HollowButton to='/controllers/control-pad'>Pad</HollowButton>
    <HollowButton to='/controllers/song'>Song</HollowButton>
    <HollowButton to='/channels'>FX</HollowButton>
    <HollowButton to='/settings'>Settings</HollowButton>
    <HollowButton to='/about'>?</HollowButton>
  </nav>
