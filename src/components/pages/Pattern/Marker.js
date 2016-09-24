import {createElement, Component} from 'react'
import {green50, pink50} from '../../../constants/colors'

export default class extends Component {
  draw () {
    const {ctx, props: {height, markerPosition, red, width}} = this
    const {clientHeight} = this.refs.canvas
    const x = markerPosition * width

    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 2
    ctx.strokeStyle = red ? pink50 : green50
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
      className: 'Pattern__Marker',
      height,
      ref: 'canvas',
      width,
    })
  }
}
