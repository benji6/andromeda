import {
  map,
  range,
  repeat,
} from 'ramda'
import {createElement, Component} from 'react'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import audioContext from '../../../audioContext'
import {
  patternBeatPlayingStart,
  patternBeatPlayingStop,
  patternBeatCellClick,
  patternMarkerPositionSet,
} from '../../../actions'
import {mapIndexed} from '../../../utils/helpers'
import ButtonPlay from '../../atoms/ButtonPlay'
import ButtonPrimary from '../../atoms/ButtonPrimary'
import Pattern from './Pattern'
import {stepExists} from '../../../reducers/patterns'
import store from '../../../store'
import sampleNames from '../../../constants/sampleNames'

let animationFrameRequest

const yLabel = i => {
  const sample = sampleNames[i]
  return sample.slice(0, sample.lastIndexOf('.wav'))
}

const emptyPatternData = defaultMemoize((xLength, yLength) =>
  map(range(0), repeat(xLength, yLength)))

const visualLoop = patternId => () => {
  const state = store.getState()
  const {playStartTime, xLength} = state.patterns[patternId]
  const {settings: {noteDuration}} = state
  const patternDuration = xLength * noteDuration
  animationFrameRequest = requestAnimationFrame(visualLoop(patternId))
  store.dispatch(patternMarkerPositionSet({
    patternId,
    value: (audioContext.currentTime - playStartTime) / patternDuration % 1,
  }))
}

const patternData = defaultMemoize((xLength, yLength, steps) => mapIndexed(
  (x, rowIndex) => map(colIndex => ({
    selected: stepExists(colIndex, rowIndex, steps),
  }), x),
  emptyPatternData(xLength, yLength)
))

const mapStateToProps = ({
  dispatch,
  patterns,
  plugins,
  settings: {bpm},
}, {params: {patternId}}) => {
  const {
    instrument,
    markerPosition,
    playing,
    playStartTime,
    steps,
    volume,
    xLength,
    yLength,
  } = patterns[patternId]

  return {
    bpm,
    dispatch,
    instrument,
    markerPosition,
    patternData: patternData(xLength, yLength, steps),
    patternId: Number(patternId),
    playing,
    playStartTime,
    plugins,
    steps,
    volume,
    xLength,
  }
}

const mapDispatchToProps = {
  patternBeatCellClick,
  patternBeatPlayingStart,
  patternBeatPlayingStop,
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class extends Component {
    constructor (props) {
      super(props)

      this.onPlay = () => {
        const {patternId, patternBeatPlayingStart} = this.props
        const {currentTime} = audioContext

        patternBeatPlayingStart({
          currentTime,
          patternId,
        })
        setTimeout(visualLoop(patternId))
      }

      this.onStop = () => {
        const {patternId, patternBeatPlayingStop} = this.props

        cancelAnimationFrame(animationFrameRequest)
        patternBeatPlayingStop(patternId)
      }
    }

    componentWillMount () {
      const {patternId, playing} = this.props
      playing && visualLoop(patternId)()
    }

    componentWillUnmount () {
      cancelAnimationFrame(animationFrameRequest)
    }

    render () {
      const {
        markerPosition,
        patternBeatCellClick,
        patternData,
        patternId,
        playing,
        sideLength,
        width,
      } = this.props

      return createElement('div', {className: 'Pattern'},
        createElement(
          'h2',
          {className: 'Pattern__Title'},
          `Pattern ${patternId} - Beat`
        ),
        createElement(Pattern, {
          markerPosition,
          onClick: y => x => () => patternBeatCellClick({patternId, x, y}),
          patternData,
          red: true,
          sideLength,
          width,
          yLabel,
        }),
        createElement(ButtonPlay, {
          onPlay: this.onPlay,
          onStop: this.onStop,
          playing,
        }),
        createElement(
          ButtonPrimary,
          {to: `/controllers/pattern/${patternId}/settings`},
          'Options'
        )
      )
    }
  }
)
