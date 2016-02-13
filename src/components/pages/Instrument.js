import React from 'react'
import {rawConnect} from '../../utils/helpers'
import {instrumentInstance} from '../../utils/derivedData'
import Navigation from '../organisms/Navigation'
import PluginMount from '../atoms/PluginMount'

export default rawConnect(({
  plugins,
  params
}) =>
  <div>
    <Navigation />
    <PluginMount
      instance={instrumentInstance(params.name, plugins)}
    />
  </div>)
