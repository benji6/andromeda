import {PropTypes} from 'prop-types'
import {createElement, Component} from 'react'

const PluginMount = class extends Component {
  componentDidMount () {
    this.props.instance.render(this.refs.mount)
  }
  render () {
    return createElement('div', {ref: 'mount'})
  }
}

PluginMount.propTypes = {
  instance: PropTypes.object.isRequired,
}

export default PluginMount
