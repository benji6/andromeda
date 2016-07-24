import React from 'react'
import {connect} from 'react-redux'
import {instrumentInstance} from '../../utils/derivedData'
import PluginMount from '../atoms/PluginMount'
import ButtonPrimary from '../atoms/ButtonPrimary'

const connectComponent = connect(({plugins}, {history, params}) => ({
  history,
  params,
  plugins,
}))

export default connectComponent(({
  history,
  params,
  plugins,
}) => <div>
  <PluginMount instance={instrumentInstance(params.name, plugins)}/>
  <div className='margin-bottom' />
  <div className='text-center'>
    <ButtonPrimary onClick={history.goBack}>OK</ButtonPrimary>
  </div>
</div>)
