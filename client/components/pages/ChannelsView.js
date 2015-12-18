import {always, compose, identity} from 'ramda'
import React from 'react'
import {mapIndexed} from '../../tools/indexedIterators'
import {connect} from 'react-redux'
import Navigation from '../organisms/Navigation'
import FullButton from '../atoms/FullButton'
import {Cross, Plus} from '../atoms/IconButtons'
import {addChannel, removeChannel} from '../../actions'

export default connect(identity)(({audioGraphAndChannels: {channels}, dispatch}) =>
  <div>
    <Navigation />
    <div className="flex-column text-center">
      <h1>Channels</h1>
      {mapIndexed((channel, i) =>
        <div key={i}>
          <FullButton text={`Channel ${i}`}
                      to={`/channel/${i}`} />
          <Cross onClick={compose(dispatch, removeChannel, always(i))}/>
        </div>, channels)}
        <div>
          Add New Channel
          <Plus onClick={compose(dispatch, addChannel)}/>
        </div>
    </div>
  </div>)
