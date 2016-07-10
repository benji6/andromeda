import {createElement, Component} from 'react'

export default class extends Component {
  componentDidMount () {
    this.props.instance.render(this.refs.mount)
  }
  render () {
    return createElement('div', {ref: 'mount'})
  }
}
