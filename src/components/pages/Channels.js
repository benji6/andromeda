import {always, compose, map, pluck} from 'ramda'
import React from 'react'
import {rawConnect} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'
import {Cross, Plus} from '../atoms/IconButtons'
import {addChannel, removeChannel} from '../../actions'

export default rawConnect(({dispatch, plugins: {channels}}) =>
  <div className='flex-column text-center'>
    {map(
      channel => <div key={channel}>
        <FullButton to={`/channel/${channel}`}>
          {`Channel ${channel}`}
        </FullButton>
        <Cross onClick={compose(dispatch, removeChannel, always(channel))}/>
      </div>,
      pluck('name', channels)
    )}
    <div>
      Add New Channel
      <Plus onClick={compose(dispatch, addChannel)}/>
    </div>
  </div>)
