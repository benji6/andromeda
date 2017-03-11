import {createElement} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {instrumentInstance} from '../../utils/derivedData'
import PluginMount from '../atoms/PluginMount'
import ButtonPrimary from '../atoms/ButtonPrimary'

const mapStateToProps = ({plugins}, {params}) => ({params, plugins})

const Instrument = ({
  params,
  plugins,
  router,
}) => createElement('div', {className: 'Instrument'},
  createElement(PluginMount, {instance: instrumentInstance(params.name, plugins)}),
  createElement(ButtonPrimary, {onClick: router.goBack}, 'OK')
)

export default connect(mapStateToProps)(withRouter(Instrument))
