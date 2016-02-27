import React from 'react'
import {rawConnect} from '../../utils/helpers'
import {instrumentInstance} from '../../utils/derivedData'
import PluginMount from '../atoms/PluginMount'

export default rawConnect(({
  plugins,
  params
}) => <PluginMount
  instance={instrumentInstance(params.name, plugins)}
/>)
