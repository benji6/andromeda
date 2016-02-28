import React from 'react'
import HollowButton from '../atoms/HollowButton'

export default _ =>
  <nav className='navigation'>
    <HollowButton text='Pad' to='/controllers/contol-pad' />
    <HollowButton text='Pattern' to='/controllers/pattern-editor' />
    <HollowButton text='Instruments' to='/plugins/instruments' />
    <HollowButton text='Effects' to='/plugins/effects' />
    <HollowButton text='Channels' to='/channels' />
    <HollowButton text='Settings' to='/settings' />
  </nav>
