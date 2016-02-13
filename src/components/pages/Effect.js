import React from 'react'
import {rawConnect} from '../../utils/helpers'
import {effectInstance} from '../../utils/derivedData'
import Navigation from '../organisms/Navigation'
import PluginMount from '../atoms/PluginMount'

export default rawConnect(({
  plugins,
  params
}) =>
  <div>
    <Navigation />
    <PluginMount
      instance={effectInstance(params.name, plugins)}
    />
  </div>)
