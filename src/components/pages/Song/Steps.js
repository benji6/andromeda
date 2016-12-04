import {createElement, Component} from 'react'
import {eventRatiosAndCoords} from '../../../utils/dom'
import {forEachIndexed} from '../../../utils/helpers'
import {
  green10,
  green40,
  green80,
  gray99,
} from '../../../constants/colors'

export default class extends Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  draw () {
    const {
      ctx,
      props: {
        height,
        isEmpty,
        patternData,
        width,
        yLabel,
      },
    } = this

    ctx.clearRect(0, 0, width, height)
    ctx.textAlign = 'center'

    if (isEmpty) {
      ctx.fillStyle = green80
      ctx.font = '4rem sans-serif'
      ctx.fillText('ADD A PATTERN', width / 2, height / 2, width * 0.8)
      return
    }

    const stepHeight = height / (patternData.length + 1)
    const stepWidth = width / (patternData[0].length + 2)

    forEachIndexed(
      (row, r) => forEachIndexed(
        ({selected}, c) => {
          ctx.fillStyle = selected ? green40 : green10
          ctx.fillRect((c + 1) * stepWidth, (r + 1) * stepHeight, stepWidth - 2, stepHeight - 2)
        },
        row
      ),
      patternData
    )

    ctx.font = '0.8rem sans-serif'
    ctx.fillStyle = gray99
    ctx.textAlign = 'center'

    forEachIndexed(
      (_, c) => {
        ctx.fillText(c + 1, (c + 1.5) * stepWidth, stepHeight / 2, stepWidth - 2)
      },
      patternData[0]
    )

    ctx.font = '0.67rem sans-serif'

    forEachIndexed(
      (_, r) => {
        ctx.fillText(yLabel(r), stepWidth / 2, (r + 1.5) * stepHeight + 3, stepWidth - 2)
        ctx.fillText('DELETE', (patternData[0].length + 1.5) * stepWidth, (r + 1.5) * stepHeight + 3, stepWidth - 2)
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
    const {isEmpty, onClick, patternData} = this.props
    if (isEmpty) return
    const {xRatio, yRatio} = eventRatiosAndCoords(e)
    const x = Math.floor(xRatio * (patternData[0].length + 2))
    const y = Math.floor(yRatio * (patternData.length + 1))
    if (x === -1 || y === -1) return
    onClick(x, y)
  }

  render () {
    const {height, width} = this.props

    return createElement('canvas', {
      height,
      onClick: this.handleClick,
      ref: 'canvas',
      width,
    })
  }
}
