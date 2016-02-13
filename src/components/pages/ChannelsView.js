import {always, compose, map} from 'ramda'
import React from 'react'
import {rawConnect} from '../../utils/helpers'
import {addChannel, removeChannel} from '../../actions'
import Navigation from '../organisms/Navigation'
import FullButton from '../atoms/FullButton'
import {Cross, Plus} from '../atoms/IconButtons'

export default rawConnect(({audioGraphAndChannels: {channels}, dispatch}) => <div>
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
