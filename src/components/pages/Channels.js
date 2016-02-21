import {map, pluck} from 'ramda'
import React from 'react'
import {rawConnect} from '../../utils/helpers'
import Navigation from '../organisms/Navigation'
import FullButton from '../atoms/FullButton'
import {Cross, Plus} from '../atoms/IconButtons'

export default rawConnect(({plugins: {channels}}) =>
  <div>
    <Navigation />
    <div className='flex-column text-center'>
      <h1>Channels</h1>
      {map(
        channel => <div key={channel}>
          <FullButton text={`Channel ${channel}`} to={`/channel/${channel}`} />
          <Cross />
        </div>,
        pluck('name', channels)
      )}
      <div>
        Add New Channel
        <Plus />
      </div>
    </div>
  </div>)
