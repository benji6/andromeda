import React from 'react'
import {mapIndexed, rawConnect} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'

export default rawConnect(({plugins: {instrumentInstances}}) =>
  <div className='flex-column text-center'>
    <h1>Instruments</h1>
    {mapIndexed(
      ({name}, key) =>
        <div {...{key}} >
          <FullButton {...{key}} text={name} to={`/plugins/instruments/${name}`}/>
        </div>,
      instrumentInstances
    )}
  </div>)
