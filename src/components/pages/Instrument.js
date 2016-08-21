import {createElement} from 'react'
import {connect} from 'react-redux'
import {instrumentInstance} from '../../utils/derivedData'
import PluginMount from '../atoms/PluginMount'
import ButtonPrimary from '../atoms/ButtonPrimary'

const mapStateToProps = ({plugins}, {history, params}) => ({
  history,
  params,
  plugins,
})

export default connect(mapStateToProps)(({
  history,
  params,
  plugins,
}) => createElement('div', {className: 'Instrument'},
  createElement(PluginMount, {instance: instrumentInstance(params.name, plugins)}),
  createElement(ButtonPrimary, {onClick: history.goBack}, 'OK')
))
