import {createElement, Component} from 'react'

export default class Marker extends Component {
  draw () {
    const {ctx, props: {color, height, markerPosition, width}} = this
    const {clientHeight} = this.refs.canvas
    const x = markerPosition * width

    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 2
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x, 14)
    ctx.lineTo(x, clientHeight)
    ctx.stroke()
  }

  componentDidUpdate () {
    this.draw()
  }

  componentDidMount () {
    this.ctx = this.refs.canvas.getContext('2d')
    this.draw()
  }

  render () {
    const {height, width} = this.props
    return createElement('canvas', {
      className: 'PatternSteps__Marker',
      height,
      ref: 'canvas',
      width,
    })
  }
}
