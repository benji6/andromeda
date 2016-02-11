import React from 'react'
import HollowButton from '../atoms/HollowButton'
import Menu from './Menu'

export default () =>
  <Menu components={[
    <HollowButton
      key='1'
      text='Pad'
      to='/control-pad'
    />,
    <HollowButton
      key='2'
      text='Pattern'
      to='/pattern-editor'
    />,
    <HollowButton
      key='3'
      text='Instruments'
      to='/instruments'
    />,
    <HollowButton
      key='4'
      text='Channels'
      to='/channels'
    />,
    <HollowButton
      key='5'
      text='Settings'
      to='/settings'
    />
  ]} />
