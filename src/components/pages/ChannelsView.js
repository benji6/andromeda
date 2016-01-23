import {always, compose, identity, map} from 'ramda'
import {connect} from 'react-redux'
import React from 'react'
import Navigation from '../organisms/Navigation'
import FullButton from '../atoms/FullButton'
import {Cross, Plus} from '../atoms/IconButtons'
import {addChannel, removeChannel} from '../../actions'

export default connect(identity)(({audioGraphAndChannels: {channels}, dispatch}) => <div>
    <Navigation />
    <div className='flex-column text-center'>
      <h1>Channels</h1>
      {map(
        ({id}) => <div key={id}>
          <FullButton text={`Channel ${id}`} to={`/channel/${id}`} />
          <Cross onClick={compose(dispatch, removeChannel, always(id))}/>
        </div>,
        channels
      )}
        <div>
          Add New Channel
          <Plus onClick={compose(dispatch, addChannel)}/>
        </div>
    </div>
  </div>)
