import React from 'react'
import {mapIndexed, rawConnect} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'

export default rawConnect(({plugins: {effectInstances}}) =>
  <div className='flex-column text-center'>
    <h1>Effects</h1>
    {mapIndexed(
      ({name}, key) =>
        <div {...{key}} >
          <FullButton {...{key}} to={`/plugins/effects/${name}`}>
            {name}
          </FullButton>
        </div>,
      effectInstances
    )}
  </div>)
