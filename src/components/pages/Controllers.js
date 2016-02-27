import React from 'react'
import {rawConnect} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'

export default rawConnect(({plugins: {instrumentInstances}}) =>
  <div className='flex-column text-center'>
    <h1>Controllers</h1>
    <div>
      <FullButton to={'/controllers/control-pad'}>Pad</FullButton>
    </div>
    <div>
      <FullButton to={'/controllers/pattern-editor'}>Pattern</FullButton>
    </div>
    <div>
      <FullButton to={'/controllers/keyboard/settings'}>Keyboard</FullButton>
    </div>
  </div>)
