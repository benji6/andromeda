import {Component, createElement} from 'react'
import Token from './Token'
import {eventRatiosAndCoords} from '../../../utils/dom'

let currentXYRatios = null
let controlPadElement = null
let mouseInputEnabled = false
let controlPadActive = false

const sideLength = () => window.innerWidth < window.innerHeight
  ? window.innerWidth
  : window.innerHeight * 0.8

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
      this.props.touched || this.props.controlPadTouched()
      currentXYRatios = eventRatiosAndCoords(e)
      this.token.handleInput(currentXYRatios)
      if (controlPadActive) return inputModifyHandler(currentXYRatios)
      controlPadActive = true
      inputStartHandler(currentXYRatios)
    }

    controlPadElement.addEventListener('touchstart', inputCallback)
    controlPadElement.addEventListener('touchmove', inputCallback)
    controlPadElement.addEventListener('mousedown', inputCallback)
    controlPadElement.addEventListener('mousemove', inputCallback)

    const inputEndCallback = () => {
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
    return createElement('div', {className: 'ControlPad'},
       !this.props.touched && createElement(
        'div',
        {
          className: 'ControlPad__Message',
        },
        'TOUCH / CLICK TO PLAY'
      ),
      createElement('canvas', {
        className: 'ControlPad__Canvas',
        height: this.state.sideLength,
        ref: 'controlPad',
        width: this.state.sideLength,
      })
    )
  }
}
