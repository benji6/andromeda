import React from 'react'
import {rawConnect} from '../../utils/helpers'
import {instrumentInstance} from '../../utils/derivedData'
import PluginMount from '../atoms/PluginMount'
import FullButton from '../atoms/FullButton'

export default rawConnect(({
  history,
  params,
  plugins
}) => <div>
  <PluginMount instance={instrumentInstance(params.name, plugins)}/>
  <div className='margin-bottom' />
  <div className='text-center'>
    <FullButton onClick={history.goBack}>OK</FullButton>
  </div>
</div>)
