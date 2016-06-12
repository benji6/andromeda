import {
  find,
  map,
  none,
  range,
  repeat,
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import audioContext from '../../audioContext'
import {
  patternActiveNotesAppend,
  patternActiveNotesReject,
  patternCellClick,
  patternPlayingStart,
  patternPlayingStop,
  setPatternMarkerPosition,
} from '../../actions'
import {mapIndexed} from '../../utils/helpers'
import ButtonPlay from '../atoms/ButtonPlay'
import ButtonPrimary from '../atoms/ButtonPrimary'
import Pattern from '../organisms/Pattern'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../../audioHelpers/pitchFromScaleIndex'
import noteNameFromPitch from '../../audioHelpers/noteNameFromPitch'
import {stepExists} from '../../reducers/patterns'
import {instrumentInstance} from '../../utils/derivedData'
import store from '../../store'
import scales from '../../constants/scales'
import patternPitchOffset from '../../constants/patternPitchOffset'

let animationFrameRequest

const yLabel = (selectedScale, yLength, rootNote) => i => noteNameFromPitch(pitchFromScaleIndex(
  scales[selectedScale],
  yLength - i - 1
) + rootNote + patternPitchOffset)

const cellClickHandler = (patternCellClick, patternId) => y => x => () => {
  const {patterns, plugins, settings: {bpm, rootNote, selectedScale}} = store.getState()
  const {
    activeNotes,
    instrument,
    nextLoopEndTime,
    playing,
    steps,
    volume,
    xLength,
    yLength,
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
        scales[selectedScale],
        yLength - 1 - y
      ) + rootNote + patternPitchOffset),
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
    rootNote,
    selectedScale,
    steps,
    volume,
    xLength,
    yLength,
  }
}

const mapDispatchToProps = {
  patternCellClick,
  patternPlayingStart,
  patternPlayingStop,
}

const visualLoop = patternId => _ => {
  const state = store.getState()
  const {playStartTime, xLength} = state.patterns[patternId]
  const {settings: {bpm}} = state
  const patternDuration = xLength * 60 / bpm
  animationFrameRequest = requestAnimationFrame(visualLoop(patternId))
  store.dispatch(setPatternMarkerPosition({
    patternId,
    value: (audioContext.currentTime - playStartTime) / patternDuration % 1,
  }))
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

        patternPlayingStop({
          animationFrameRequest,
          patternId,
        })
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
        rootNote,
        selectedScale,
        yLength,
      } = this.props

      return <div>
        <h2 className='text-center'>{`Pattern ${patternId}`}</h2>
        <Pattern {...{
          markerPosition,
          onClick: cellClickHandler(patternCellClick, patternId),
          patternData,
          yLabel: yLabel(selectedScale, yLength, rootNote),
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
