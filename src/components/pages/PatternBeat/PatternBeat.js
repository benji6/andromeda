import {createElement, Component} from 'react'
import audioContext from '../../../audioContext'
import PatternSteps from '../../organisms/PatternSteps'
import {patternBeatMarkerPositionSet} from '../../../actions'
import {findById} from '../../../utils/helpers'
import ButtonPlay from '../../atoms/ButtonPlay'
import store from '../../../store'
import sampleNames from '../../../constants/sampleNames'
import StepVelocitySelector from '../../atoms/StepVelocitySelector'
import {getCssVar} from '../../../vars/cssVars'

const getColor = vel => getCssVar(`--red-${vel === undefined ? '05' : (vel * 30 + 20).toFixed(0)}`)

let animationFrameRequest

const yLabel = i => {
  const sample = sampleNames[i]
  return sample.slice(0, sample.lastIndexOf('.wav'))
}

const visualLoop = patternId => () => {
  const state = store.getState()
  const {playStartTime, xLength} = findById(patternId, state.patternsBeat)
  const {settings: {noteDuration}} = state
  const patternDuration = xLength * noteDuration
  animationFrameRequest = requestAnimationFrame(visualLoop(patternId))
  store.dispatch(patternBeatMarkerPositionSet({
    patternId,
    value: (audioContext.currentTime - playStartTime) / patternDuration % 1,
  }))
}

export default class PatternBeat extends Component {
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
      height,
      markerPosition,
      patternBeatStepsAdd,
      patternBeatStepsRemove,
      patternBeatStepVelocitySet,
      patternData,
      patternId,
      playing,
      stepVelocity,
      width,
    } = this.props

    const xLength = patternData[0].length + 1
    const markerLeft = 1 / xLength
    const scrollBarWidthFactor = 0.02

    return createElement('div', {className: 'PatternBeat'},
      createElement(PatternSteps, {
        getColor,
        height,
        markerColor: getCssVar('--pink-50'),
        markerPosition: markerPosition * (1 - markerLeft - scrollBarWidthFactor) + markerLeft,
        patternData,
        patternId,
        stepAdd: patternBeatStepsAdd,
        stepRemove: patternBeatStepsRemove,
        width,
        yLabel,
      }),
      createElement('div', {className: 'PatternBeat__Controls'},
        createElement(ButtonPlay, {
          onPlay: this.onPlay,
          onStop: this.onStop,
          playing,
        }),
        createElement(StepVelocitySelector, {
          color: getColor(stepVelocity),
          onClick: () => patternBeatStepVelocitySet({
            patternId,
            value: stepVelocity <= 1 / 3 ? 2 / 3 : stepVelocity <= 2 / 3 ? 1 : 1 / 3,
          }),
        })
      )
    )
  }
}
