import {PropTypes} from 'prop-types'
import {createElement, Component} from 'react'

const PluginMount = class extends Component {
  componentDidMount () {
    this.props.instance.render(this.el)
  }
  render () {
    return createElement('div', {ref: el => this.el = el})
  }
}

PluginMount.propTypes = {
  instance: PropTypes.object.isRequired,
}

export default PluginMount
