import {createElement, Component} from 'react'
import audioContext from '../../../audioContext'
import {patternSynthMarkerPositionSet} from '../../../actions'
import {findById} from '../../../utils/helpers'
import ButtonPlay from '../../atoms/ButtonPlay'
import ButtonPrimary from '../../atoms/ButtonPrimary'
import pitchFromScaleIndex from '../../../audioHelpers/pitchFromScaleIndex'
import noteNameFromPitch from '../../../audioHelpers/noteNameFromPitch'
import store from '../../../store'
import scales from '../../../constants/scales'
import patternPitchOffset from '../../../constants/patternPitchOffset'
import PatternSteps from '../../organisms/PatternSteps'
import {getCssVar} from '../../../vars/cssVars'
import StepVelocitySelector from '../../atoms/StepVelocitySelector'

let animationFrameRequest

const getColor = vel => getCssVar(`--blue-${vel === undefined ? '05' : (vel * 30 + 20).toFixed(0)}`)

const yLabel = (selectedScale, yLength, rootNote) => i => noteNameFromPitch(pitchFromScaleIndex(
  scales[selectedScale],
  yLength - i - 1
) + rootNote + patternPitchOffset)

const visualLoop = patternId => () => {
  const state = store.getState()
  const {playStartTime, xLength} = findById(patternId, state.patternsSynth)
  const {settings: {noteDuration}} = state
  const patternDuration = xLength * noteDuration
  animationFrameRequest = requestAnimationFrame(visualLoop(patternId))
  store.dispatch(patternSynthMarkerPositionSet({
    patternId,
    value: (audioContext.currentTime - playStartTime) / patternDuration % 1,
  }))
}

export default class PatternSynth extends Component {
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
      height,
      markerPosition,
      patternData,
      patternId,
      patternSynthStepsAdd,
      patternSynthStepsRemove,
      patternSynthStepVelocitySet,
      playing,
      rootNote,
      selectedScale,
      stepVelocity,
      width,
      yLength,
    } = this.props

    const xLength = patternData[0].length + 1
    const markerLeft = 1 / xLength
    const scrollBarWidthFactor = 0.02

    return createElement('div', {className: 'PatternSynth'},
      createElement(PatternSteps, {
        getColor,
        height,
        markerColor: getCssVar('--green-50'),
        markerPosition: markerPosition * (1 - markerLeft - scrollBarWidthFactor) + markerLeft,
        patternData,
        patternId,
        stepAdd: patternSynthStepsAdd,
        stepRemove: patternSynthStepsRemove,
        width,
        yLabel: yLabel(selectedScale, yLength, rootNote),
      }),
      createElement('div', {className: 'PatternSynth__Controls'},
        createElement('div'),
        createElement(ButtonPlay, {
          onPlay: this.onPlay,
          onStop: this.onStop,
          playing,
        }),
        createElement(StepVelocitySelector, {
          color: getColor(stepVelocity),
          onClick: () => patternSynthStepVelocitySet({
            patternId,
            value: stepVelocity <= 1 / 3 ? 2 / 3 : stepVelocity <= 2 / 3 ? 1 : 1 / 3,
          }),
        }),
        createElement(
          ButtonPrimary,
          {to: `/controllers/pattern-synth/${patternId}/settings`},
          'Options'
        )
      )
    )
  }
}
