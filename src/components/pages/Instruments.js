import {identity} from 'ramda'
import {connect} from 'react-redux'
import React from 'react'
import {mapIndexed} from '../../utils/helpers'
import Navigation from '../organisms/Navigation'
import FullButton from '../atoms/FullButton'

export default connect(identity)(({plugins: {instrumentInstances}}) =>
  <div>
    <Navigation />
    <div className='flex-column text-center'>
      <h1>Instruments</h1>
      {mapIndexed(
        ({name}, key) =>
          <div {...{key}} >
            <FullButton {...{key}} text={name} to={`/instruments/${name}`}/>
          </div>,
        instrumentInstances
      )}
    </div>
  </div>)
