import {createElement, Component, PropTypes} from 'react'

const PluginMount = class extends Component {
  componentDidMount () {
    this.props.instance.render(this.refs.mount)
  }
  render () {
    return createElement('div', {ref: 'mount'})
  }
}

if (process.env.NODE_ENV !== 'production') {
  PluginMount.propTypes = {
    instance: PropTypes.object.isRequired,
  }
}

export default PluginMount
