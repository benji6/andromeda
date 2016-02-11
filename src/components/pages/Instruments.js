import {identity} from 'ramda'
import {connect} from 'react-redux'
import React from 'react'
import {mapIndexed} from '../../utils/helpers'
import Navigation from '../organisms/Navigation'

export default connect(identity)(({plugins: {instrumentInstances}}) =>
  <div>
    <Navigation />
    <div className='flex-column text-center'>
      <h1>Instruments</h1>
      {mapIndexed(
        ({name}, key) => <div {...{key}} >{name}</div>,
        instrumentInstances
      )}
    </div>
  </div>)
