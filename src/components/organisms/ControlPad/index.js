import {clamp} from 'ramda'
import {Component, createElement} from 'react'
import Token from './Token'

let currentXYRatios = null
let controlPadElement = null
let mouseInputEnabled = false
let controlPadActive = false

const validRatio = clamp(0, 1 - Number.EPSILON)

const sideLength = _ => window.innerWidth < window.innerHeight
  ? window.innerWidth
  : window.innerHeight * 0.8

const ratiosAndCoords = e => {
  const {top, right, bottom, left} = e.target.getBoundingClientRect()
  const [width, height] = [right - left, bottom - top]
  const {clientX, clientY} = e.changedTouches && e.changedTouches[0] || e
  const [x, y] = [clientX - left, clientY - top]
  return {
    x,
    xRatio: validRatio(x / width),
    y,
    yRatio: validRatio(y / height),
  }
}

export default class extends Component {
  constructor () {
    super()
    this.state = {sideLength: sideLength()}
    this.resizeHandler = () => {
      const l = sideLength()
      this.setState({sideLength: l})
      this.token.handleResize(l)
    }
  }

  componentDidMount () {
    this.token = new Token({
      gl: this.refs.controlPad.getContext('webgl'),
      sideLength: this.state.sideLength,
    })
    const {inputStopHandler, inputStartHandler, inputModifyHandler} = this.props
    controlPadElement = this.refs.controlPad

    const inputCallback = e => {
      mouseInputEnabled = e.type === 'mousedown' ? true : mouseInputEnabled
      if (e instanceof window.MouseEvent && !mouseInputEnabled) return
      currentXYRatios = ratiosAndCoords(e)
      this.token.handleInput(currentXYRatios)
      if (controlPadActive) return inputModifyHandler(currentXYRatios)
      controlPadActive = true
      inputStartHandler(currentXYRatios)
    }

    controlPadElement.addEventListener('touchstart', inputCallback)
    controlPadElement.addEventListener('touchmove', inputCallback)
    controlPadElement.addEventListener('mousedown', inputCallback)
    controlPadElement.addEventListener('mousemove', inputCallback)

    const inputEndCallback = _ => {
      controlPadActive = mouseInputEnabled = false
      inputStopHandler()
      this.token.handleInputEnd()
    }

    controlPadElement.addEventListener('touchend', inputEndCallback)
    controlPadElement.addEventListener('mouseup', inputEndCallback)

    controlPadElement.oncontextmenu = e => e.preventDefault()

    window.addEventListener('resize', this.resizeHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeHandler)
  }

  render () {
    return createElement('canvas', {
      className: 'ControlPad',
      height: this.state.sideLength,
      ref: 'controlPad',
      width: this.state.sideLength,
    })
  }
}
