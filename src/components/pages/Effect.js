import {createElement} from 'react'
import {connect} from 'react-redux'
import {effectInstance} from '../../utils/derivedData'
import ButtonPrimary from '../atoms/ButtonPrimary'
import PluginMount from '../atoms/PluginMount'

const mapStateToProps = ({plugins}, {history, params}) => ({
  history,
  params,
  plugins,
})

export default connect(mapStateToProps)(({
  history,
  params,
  plugins,
}) => createElement('div', {className: 'Effect'},
  createElement(PluginMount, {instance: effectInstance(params.name, plugins)}),
  createElement(ButtonPrimary, {onClick: history.goBack}, 'OK')
))
