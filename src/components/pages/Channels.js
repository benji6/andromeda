import {always, compose, map, pluck} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import FullButton from '../atoms/FullButton'
import {Cross, Plus} from '../atoms/ButtonIcons'
import {addChannel, removeChannel} from '../../actions'

const connectComponent = connect(({dispatch, plugins: {channels}}) => ({
  dispatch,
  channels
}))

export default connectComponent(({dispatch, channels}) =>
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
      <Plus onClick={compose(dispatch, addChannel)}>Add new channel</Plus>
    </div>
  </div>)
