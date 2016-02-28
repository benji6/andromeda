import React from 'react'

export default class extends React.Component {
  componentDidMount () {
    this.props.instance.render(this.refs.mount) // eslint-disable-line
  }
  render () {
    return <div ref='mount' />
  }
}
