import React from 'react'
import HollowButton from '../atoms/HollowButton'

export default _ =>
  <nav className='navigation'>
    <HollowButton text='Pad' to='/control-pad' />
    <HollowButton text='Pattern' to='/pattern-editor' />
    <HollowButton text='Instruments' to='/instruments' />
    <HollowButton text='Effects' to='/effects' />
    <HollowButton text='Channels' to='/channels' />
    <HollowButton text='Settings' to='/settings' />
  </nav>
