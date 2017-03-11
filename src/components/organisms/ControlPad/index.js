import {Component, createElement} from 'react'
import Token from './Token'
import {eventRatiosAndCoords} from '../../../utils/dom'

let currentXYRatios = null
let controlPadElement = null
let mouseInputEnabled = false
let controlPadActive = false

export default class extends Component {
  componentDidMount () {
    this.token = new Token({
      gl: this.refs.controlPad.getContext('webgl'),
      sideLength: this.props.sideLength,
    })
    const {inputStopHandler, inputStartHandler, inputModifyHandler} = this.props
    controlPadElement = this.refs.controlPad

    const inputCallback = e => {
      mouseInputEnabled = e.type === 'mousedown' ? true : mouseInputEnabled
      if (e instanceof window.MouseEvent && !mouseInputEnabled) return
      this.props.isTouched || this.props.controlPadTouched()
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
  }

  componentDidUpdate () {
    this.token.handleResize(this.props.sideLength)
  }

  render () {
    const {sideLength} = this.props
    return createElement('div', {className: 'ControlPad'},
      !this.props.isTouched && createElement(
        'div',
        {
          className: 'ControlPad__Message',
        },
        'TOUCH / CLICK TO PLAY'
      ),
      createElement('canvas', {
        className: 'ControlPad__Canvas',
        height: sideLength,
        ref: 'controlPad',
        width: sideLength,
      })
    )
  }
}
