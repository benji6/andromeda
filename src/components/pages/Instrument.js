import {identity} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import Navigation from '../organisms/Navigation'

export default connect(identity)(({
  plugins,
  params
}) =>
  <div>
    <Navigation />
    <div className='flex-column text-center justify-center'>
      <h1>{params.name}</h1>
    </div>
  </div>)
