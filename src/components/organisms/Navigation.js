import React from 'react'
import HollowButton from '../atoms/HollowButton'

export default _ =>
  <nav className='navigation'>
    <HollowButton to='/controllers/control-pad'>Pad</HollowButton>
    <HollowButton to='/controllers/pattern-editor'>Pattern</HollowButton>
    <HollowButton to='/channels'>Channels</HollowButton>
    <HollowButton to='/settings'>Settings</HollowButton>
  </nav>
