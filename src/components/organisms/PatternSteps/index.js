import {createElement, Component} from 'react'
import {eventRatiosAndCoords} from '../../../utils/dom'
import {forEachIndexed} from '../../../utils/helpers'
import {getCssVar} from '../../../vars/cssVars'
import Marker from './Marker'

export default class PatternSteps extends Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  draw () {
    const {
      ctx,
      props: {
        height,
        getColor,
        patternData,
        width,
        yLabel,
      },
    } = this

    ctx.clearRect(0, 0, width, height)

    const stepHeight = height / (patternData.length + 1)
    const stepWidth = width / (patternData[0].length + 1)

    forEachIndexed(
      (row, r) => forEachIndexed(
        ({selected, velocity}, c) => {
          ctx.fillStyle = getColor(velocity),
          ctx.fillRect((c + 1) * stepWidth, (r + 1) * stepHeight, stepWidth - 2, stepHeight - 2)
        },
        row
      ),
      patternData
    )

    ctx.font = '0.67rem sans-serif'
    ctx.fillStyle = getCssVar('--gray-99')
    ctx.textAlign = 'center'

    forEachIndexed(
      (_, c) => {
        ctx.fillText(c + 1, (c + 1.5) * stepWidth, 10, stepWidth - 2)
      },
      patternData[0]
    )

    forEachIndexed(
      (_, r) => {
        ctx.fillText(yLabel(r), stepWidth / 2, (r + 1.5) * stepHeight + 3, stepWidth - 2)
      },
      patternData
    )
  }

  componentDidUpdate () {
    this.draw()
  }

  componentDidMount () {
    this.ctx = this.refs.canvas.getContext('2d')
    this.draw()
  }

  handleClick (e) {
    const {
      patternData,
      patternId,
      stepAdd,
      stepRemove,
    } = this.props
    const {xRatio, yRatio} = eventRatiosAndCoords(e)
    const x = Math.floor(xRatio * (patternData[0].length + 1)) - 1
    const y = Math.floor(yRatio * (patternData.length + 1)) - 1
    if (x === -1 || y === -1) return
    (patternData[y][x].selected ? stepRemove : stepAdd)({patternId, x, y})
  }

  render () {
    const {
      height,
      markerColor,
      markerPosition,
      width,
    } = this.props

    return createElement('div', {className: 'PatternSteps'},
      createElement('canvas', {
        height,
        onClick: this.handleClick,
        ref: 'canvas',
        width,
      }),
      createElement(Marker, {
        color: markerColor,
        height,
        markerPosition,
        width,
      })
    )
  }
}
