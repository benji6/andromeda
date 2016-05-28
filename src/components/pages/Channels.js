import {map, pluck} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import ButtonPrimary from '../atoms/ButtonPrimary'
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
        <ButtonPrimary to={`/channel/${channel}`}>
          {`Channel ${channel}`}
        </ButtonPrimary>
        <Cross onClick={comp(dispatch, removeChannel, K(channel))}/>
      </div>,
      pluck('name', channels)
    )}
    <div>
      <Plus onClick={comp(dispatch, addChannel)}>Add new channel</Plus>
    </div>
  </div>)
