import React from 'react'
import {rawConnect} from '../../utils/helpers'
import Navigation from '../organisms/Navigation'

export default rawConnect(({
  params
}) => {
  const channelId = Number(params.channelId)
  return <div>
    <Navigation />
    <div className='flex-column text-center justify-center'>
      <h1>{`Channel ${channelId}`}</h1>
      <h2>Sources</h2>
      <h2>Effects</h2>
    </div>
  </div>
})
