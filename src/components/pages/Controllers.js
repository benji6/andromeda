import React from 'react'
import {rawConnect} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'

export default rawConnect(({plugins: {instrumentInstances}}) =>
  <div className='flex-column text-center'>
    <h1>Controllers</h1>
    <div>
      <FullButton text='Pad' to={'/controllers/control-pad'}/>
    </div>
    <div>
      <FullButton text='Pattern' to={'/controllers/pattern-editor'}/>
    </div>
    <div>
      <FullButton text='Keyboard Settings' to={'/controllers/keyboard/settings'}/>
    </div>
  </div>)
