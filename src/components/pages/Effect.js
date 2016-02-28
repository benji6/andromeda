import React from 'react'
import {rawConnect} from '../../utils/helpers'
import {effectInstance} from '../../utils/derivedData'
import FullButton from '../atoms/FullButton'
import PluginMount from '../atoms/PluginMount'

export default rawConnect(({
  history,
  params,
  plugins
}) => <div>
  <PluginMount instance={effectInstance(params.name, plugins)}/>
  <div className='margin-bottom' />
  <div className='text-center'>
    <FullButton onClick={history.goBack}>OK</FullButton>
  </div>
</div>)
