import {map, nth, prop} from 'ramda'
import React from 'react'
import FullButton from '../atoms/FullButton'
import {rawConnect} from '../../utils/helpers'

export default rawConnect(({
  params,
  plugins: {channels}
}) => {
  const channelId = Number(params.channelId)
  return <div className='flex-column text-center justify-center'>
    <h1>{`Channel ${channelId}`}</h1>
    <h2>Sources</h2>
    <div className='text-center'>
      {map(
        x => <FullButton key={x} to={`/plugins/instruments/${x}`}>
          {x}
        </FullButton>,
        prop('instruments', nth(params.channelId, channels))
      )}
    </div>
    <h2>Effects</h2>
      <div className='text-center'>
        {map(
          x => <FullButton key={x} to={`/plugins/effects/${x}`}>
            {x}
          </FullButton>,
          prop('effects', nth(params.channelId, channels))
        )}
      </div>
  </div>
})
