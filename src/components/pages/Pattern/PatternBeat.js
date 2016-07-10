import {
  find,
  map,
  none,
  range,
  repeat,
} from 'ramda'
import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import audioContext from '../../../audioContext'
import {
  patternActiveNotesAppend,
  patternActiveNotesReject,
  patternCellClick,
  patternPlayingStart,
  patternPlayingStop,
  patternMarkerPositionSet,
} from '../../../actions'
import {mapIndexed} from '../../../utils/helpers'
import ButtonPlay from '../../atoms/ButtonPlay'
import ButtonPrimary from '../../atoms/ButtonPrimary'
import Pattern from '../../organisms/Pattern'
import pitchToFrequency from '../../../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../../../audioHelpers/pitchFromScaleIndex'
import {stepExists} from '../../../reducers/patterns'
import {instrumentInstance} from '../../../utils/derivedData'
import store from '../../../store'
import scales from '../../../constants/scales'
import patternPitchOffset from '../../../constants/patternPitchOffset'
import samples from '../../../constants/samples'

let animationFrameRequest

const yLabel = i => {
  const sample = samples[i]
  return sample.slice(0, sample.lastIndexOf('.wav'))
}

const cellClickHandler = (patternCellClick, patternId) => y => x => () => {
  const {patterns, plugins, settings: {bpm}} = store.getState()
  const {
    activeNotes,
    instrument,
    nextLoopEndTime,
    playing,
    steps,
    volume,
    xLength,
  } = patterns[patternId]
  patternCellClick({patternId, x, y})
  if (!playing) return
  const isAddedNote = none(note => note.x === x && note.y === y, steps)
  if (isAddedNote) {
    const instrumentObj = instrumentInstance(instrument, plugins)
    const noteDuration = 60 / bpm
    const id = `pattern-${patternId}-${x}-${y}`
    const note = {
      frequency: pitchToFrequency(pitchFromScaleIndex(
        scales.pentatonic,
        15 - y
      ) + patternPitchOffset),
      gain: volume,
      id,
      startTime: nextLoopEndTime + noteDuration * (x - xLength),
      stopTime: nextLoopEndTime + noteDuration * (x - xLength + 1),
    }
    store.dispatch(patternActiveNotesAppend({patternId, value: {id, instrumentObj}}))
    instrumentObj.noteStart(note)
  } else {
    const {id, instrumentObj} = find(
      ({id}) => id.indexOf(`pattern-${patternId}-${x}-${y}`) !== -1,
      activeNotes
    )
    store.dispatch(patternActiveNotesReject({patternId, value: x => x.id === id}))
    instrumentObj.noteStop(id)
  }
}

const emptyPatternData = defaultMemoize((xLength, yLength) =>
  map(range(0), repeat(xLength, yLength)))

const visualLoop = patternId => () => {
  const state = store.getState()
  const {playStartTime, xLength} = state.patterns[patternId]
  const {settings: {bpm}} = state
  const patternDuration = xLength * 60 / bpm
  animationFrameRequest = requestAnimationFrame(visualLoop(patternId))
  store.dispatch(patternMarkerPositionSet({
    patternId,
    value: (audioContext.currentTime - playStartTime) / patternDuration % 1,
  }))
}

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

  const patternData = mapIndexed(
    (x, rowIndex) => map(colIndex => ({
      selected: stepExists(colIndex, rowIndex, steps)
    }), x),
    emptyPatternData(xLength, yLength)
  )

  return {
    bpm,
    dispatch,
    instrument,
    markerPosition,
    patternData,
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
  patternCellClick,
  patternPlayingStart,
  patternPlayingStop,
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component {
    constructor (props) {
      super(props)

      this.onPlay = () => {
        const {patternId, patternPlayingStart} = this.props
        const {currentTime} = audioContext

        patternPlayingStart({
          currentTime,
          patternId,
        })
        setTimeout(visualLoop(patternId))
      }

      this.onStop = () => {
        const {patternId, patternPlayingStop} = this.props

        cancelAnimationFrame(animationFrameRequest)
        patternPlayingStop(patternId)
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
        patternCellClick,
        patternData,
        patternId,
        playing,
      } = this.props

      return <div className='PatternPage'>
        {createElement(
          'h2',
          {className: 'PatternPage__Title'},
          'Beat Pattern'
        )}
        <Pattern {...{
          markerPosition,
          onClick: cellClickHandler(patternCellClick, patternId),
          patternData,
          red: true,
          yLabel,
        }} />
        <ButtonPlay {...{
          onPlay: this.onPlay,
          onStop: this.onStop,
          playing,
        }} />
        <nav>
          <ButtonPrimary to={`/controllers/pattern/${patternId}/settings`}>
            Options
          </ButtonPrimary>
        </nav>
      </div>
    }
  }
)
