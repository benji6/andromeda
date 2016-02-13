import React from 'react'
import {mapIndexed, rawConnect} from '../../utils/helpers'
import Navigation from '../organisms/Navigation'
import FullButton from '../atoms/FullButton'

export default rawConnect(({plugins: {effectInstances}}) =>
  <div>
    <Navigation />
    <div className='flex-column text-center'>
      <h1>Effects</h1>
      {mapIndexed(
        ({name}, key) =>
          <div {...{key}} >
            <FullButton {...{key}} text={name} to={`/effects/${name}`}/>
          </div>,
        effectInstances
      )}
    </div>
  </div>)
