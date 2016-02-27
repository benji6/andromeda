import React from 'react'
import {rawConnect} from '../../utils/helpers'
import {effectInstance} from '../../utils/derivedData'
import PluginMount from '../atoms/PluginMount'

export default rawConnect(({
  plugins,
  params
}) => <PluginMount
  instance={effectInstance(params.name, plugins)}
/>)
