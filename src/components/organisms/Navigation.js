import React from 'react'
import HollowButton from '../atoms/HollowButton'

export default _ =>
  <nav className='navigation'>
    <HollowButton text='Controllers' to='/controllers' />
    <HollowButton text='Plugins' to='/plugins' />
    <HollowButton text='Channels' to='/channels' />
    <HollowButton text='Settings' to='/settings' />
  </nav>
