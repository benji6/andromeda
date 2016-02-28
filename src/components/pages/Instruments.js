import React from 'react'
import {mapIndexed, rawConnect} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'

export default rawConnect(({plugins: {instrumentInstances}}) =>
  <div className='flex-column text-center'>
    {mapIndexed(
      ({name}, key) =>
        <div {...{key}} >
          <FullButton {...{key}} to={`/plugins/instruments/${name}`}>
            {name}
          </FullButton>
        </div>,
      instrumentInstances
    )}
  </div>)
