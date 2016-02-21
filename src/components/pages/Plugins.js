import React from 'react'
import {rawConnect} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'

export default rawConnect(({plugins: {instrumentInstances}}) =>
  <div className='flex-column text-center'>
    <h1>Plugins</h1>
    <div>
      <FullButton to={'/plugins/instruments'}>Instruments</FullButton>
    </div>
    <div>
      <FullButton to={'/plugins/effects'}>Effects</FullButton>
    </div>
  </div>)
