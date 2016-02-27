import React, {PropTypes} from 'react'

export default class extends React.Component {
  static propTypes = {instance: PropTypes.obj};
  componentDidMount () {
    this.props.instance.render(this.refs.mount)
  }
  render () {
    return <div ref='mount' />
  }
}
