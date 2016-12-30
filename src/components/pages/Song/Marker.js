import {createElement, Component, PropTypes} from 'react'
import {blue40} from '../../../constants/colors'

const Marker = class extends Component {
  draw () {
    const {ctx, props: {height, markerPosition, width}} = this
    const {clientHeight} = this.refs.canvas
    const x = markerPosition * width

    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 2
    ctx.strokeStyle = blue40
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
      className: 'Song__Marker',
      height,
      ref: 'canvas',
      width,
    })
  }
}

if (process.env.NODE_ENV !== 'production') {
  Marker.propTypes = {
    height: PropTypes.number.isRequired,
    markerPosition: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }
}

export default Marker
