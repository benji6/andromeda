import {identity} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import Navigation from '../organisms/Navigation'
import PluginMount from '../atoms/PluginMount'
import {instrumentInstance} from '../../utils/derivedData'

export default connect(identity)(({
  plugins,
  params
}) =>
  <div>
    <Navigation />
    <PluginMount
      instance={instrumentInstance(params.name, plugins)}
    />
  </div>)
