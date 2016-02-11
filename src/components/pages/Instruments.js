import {identity} from 'ramda'
import {connect} from 'react-redux'
import React from 'react'
import Navigation from '../organisms/Navigation'

export default connect(identity)(({plugins}) => <div>
    <Navigation />
    <div className='flex-column text-center'>
      <h1>Instruments</h1>
    </div>
  </div>)
