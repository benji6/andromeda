import {createElement} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {effectInstance} from '../../utils/derivedData'
import ButtonPrimary from '../atoms/ButtonPrimary'
import PluginMount from '../atoms/PluginMount'

const mapStateToProps = ({plugins}, {params}) => ({params, plugins})

const Effect = ({
  params,
  plugins,
  router,
}) => createElement('div', {className: 'Effect'},
  createElement(PluginMount, {instance: effectInstance(params.name, plugins)}),
  createElement(ButtonPrimary, {onClick: router.goBack}, 'OK')
)

export default connect(mapStateToProps)(withRouter(Effect))
