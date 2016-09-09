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
  patternSynthCellClick,
  patternMarkerPositionSet,
  patternSynthPlayingStart,
  patternSynthPlayingStop,
} from '../../../actions'
import {mapIndexed} from '../../../utils/helpers'
import ButtonPlay from '../../atoms/ButtonPlay'
import ButtonPrimary from '../../atoms/ButtonPrimary'
import Pattern from './Pattern'
import pitchFromScaleIndex from '../../../audioHelpers/pitchFromScaleIndex'
import noteNameFromPitch from '../../../audioHelpers/noteNameFromPitch'
import {stepExists} from '../../../reducers/patterns'
import store from '../../../store'
import scales from '../../../constants/scales'
import patternPitchOffset from '../../../constants/patternPitchOffset'

let animationFrameRequest

const yLabel = (selectedScale, yLength, rootNote) => i => noteNameFromPitch(pitchFromScaleIndex(
  scales[selectedScale],
  yLength - i - 1
) + rootNote + patternPitchOffset)

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
  settings: {bpm, rootNote, selectedScale},
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
    rootNote,
    selectedScale,
    steps,
    volume,
    xLength,
    yLength,
  }
}

const mapDispatchToProps = {
  patternSynthCellClick,
  patternSynthPlayingStart,
  patternSynthPlayingStop,
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class extends Component {
    constructor (props) {
      super(props)

      this.onPlay = () => {
        const {patternId, patternSynthPlayingStart} = this.props
        const {currentTime} = audioContext

        patternSynthPlayingStart({
          currentTime,
          patternId,
        })
        setTimeout(visualLoop(patternId))
      }

      this.onStop = () => {
        const {patternId, patternSynthPlayingStop} = this.props

        cancelAnimationFrame(animationFrameRequest)
        patternSynthPlayingStop(patternId)
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
        patternData,
        patternId,
        patternSynthCellClick,
        playing,
        rootNote,
        selectedScale,
        sideLength,
        width,
        yLength,
      } = this.props

      return createElement('div', {className: 'Pattern'},
        createElement(
          'h2',
          {className: 'Pattern__Title'},
          `Pattern ${patternId} - Synth`
        ),
        createElement(Pattern, {
          markerPosition,
          onClick: y => x => () => patternSynthCellClick({patternId, x, y}),
          patternData,
          sideLength,
          width,
          yLabel: yLabel(selectedScale, yLength, rootNote),
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
