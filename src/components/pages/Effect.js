import React from 'react'
import {connect} from 'react-redux'
import {effectInstance} from '../../utils/derivedData'
import FullButton from '../atoms/FullButton'
import PluginMount from '../atoms/PluginMount'

const connectComponent = connect(({plugins}, {history, params}) => ({
  history,
  params,
  plugins
}))

export default connectComponent(({
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
