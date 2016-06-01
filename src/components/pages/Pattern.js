import {
  curry,
  curryN,
  find,
  forEach,
  map,
  none,
  range,
  reject,
  repeat,
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import audioContext from '../../audioContext'
import {
  patternActiveNotesAppend,
  patternActiveNotesSet,
  patternActiveNotesClear,
  patternActiveNotesReject,
  patternCellClick,
  setPatternMarkerPosition,
  setPatternNextLoopEndTime,
  setPatternPlaying,
  setPatternPlayStartTime,
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

const patternPitchOffset = -12
let animationFrameRequest
let timeoutId

const yLabel = curry(
  (selectedScale, yLength, rootNote, i) => noteNameFromPitch(pitchFromScaleIndex(
    scales[selectedScale],
    yLength - i - 1
  ) + rootNote + patternPitchOffset)
)

const cellClickHandler = curryN(5, (dispatch, patternId, y, x) => {
  const state = store.getState()
  const {patterns, plugins, settings: {bpm, rootNote, selectedScale}} = state
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
  dispatch(patternCellClick({patternId, x, y}))
  if (!playing) return
  const isAddedNote = none(note => note.x === x && note.y === y, steps)
  if (isAddedNote) {
    const instrumentObj = instrumentInstance(instrument, plugins)
    const noteDuration = 60 / bpm
    const id = `pattern-${patternId}-${x}-${y}`
    const note = {
      frequency: pitchToFrequency(pitchFromScaleIndex(
        scales[selectedScale],
        yLength - 1 - y + scales[selectedScale].length
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
})

const emptyPatternData = defaultMemoize((xLength, yLength) =>
  map(range(0), repeat(xLength, yLength)))

const connectComponent = connect(({
  dispatch,
  patterns,
  plugins,
  settings: {bpm, rootNote, selectedScale},
}, {params: {patternId}}) => {
  const {
    activeNotes,
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
    activeNotes,
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
})

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

export default connectComponent(class extends React.Component {
  componentWillMount () {
    const {patternId, playing} = this.props
    playing && visualLoop(patternId)()
  }

  componentWillUnmount () {
    cancelAnimationFrame(animationFrameRequest)
  }

  onPlay () {
    const {patternId} = this.props
    store.dispatch(setPatternPlayStartTime({patternId, value: audioContext.currentTime}))
    const {playStartTime} = this.props
    store.dispatch(setPatternNextLoopEndTime({patternId, value: playStartTime}))
    const audioLoop = (i = 0) => {
      const state = store.getState()
      const {patterns, plugins, settings: {bpm, rootNote, selectedScale}} = state
      const {
        activeNotes,
        instrument,
        nextLoopEndTime,
        steps,
        volume,
        xLength,
        yLength,
      } = patterns[patternId]
      const instrumentObj = instrumentInstance(instrument, plugins)
      const noteDuration = 60 / bpm
      const patternDuration = xLength * noteDuration
      const currentLoopEndTime = nextLoopEndTime
      const newLoopEndTime = nextLoopEndTime + patternDuration
      store.dispatch(setPatternNextLoopEndTime({
        patternId,
        value: newLoopEndTime,
      }))

      timeoutId = setTimeout(
        _ => audioLoop(i + 1),
        (newLoopEndTime - audioContext.currentTime - 0.1) * 1000
      )

      store.dispatch(patternActiveNotesSet({
        patternId,
        value: reject(({id}) => {
          for (const {x, y} of steps) {
            if (id.indexOf(`pattern-${patternId}-${x}-${y}`) !== -1) return true
          }
        }, activeNotes).concat(map(({x, y}) => ({
          id: `pattern-${patternId}-${x}-${y}-${i}`,
          instrumentObj,
        }), steps))}))

      const notes = map(({x, y}) => ({
        frequency: pitchToFrequency(pitchFromScaleIndex(
          scales[selectedScale],
          yLength - 1 - y + scales[selectedScale].length
        ) + rootNote + patternPitchOffset),
        gain: volume,
        id: `pattern-${patternId}-${x}-${y}-${i}`,
        startTime: currentLoopEndTime + noteDuration * x,
        stopTime: currentLoopEndTime + noteDuration * (x + 1),
      }), steps)

      instrumentObj.notesStart(notes)
      i++
    }

    audioLoop()
    visualLoop(patternId)()
  }

  onStop () {
    const {activeNotes, dispatch, patternId} = this.props
    forEach(({id, instrumentObj}) => instrumentObj.noteStop(id), activeNotes)
    dispatch(patternActiveNotesClear(patternId))
    clearTimeout(timeoutId)
    cancelAnimationFrame(animationFrameRequest)
    dispatch(setPatternMarkerPosition({patternId, value: 0}))
  }

  render () {
    const {
      dispatch,
      markerPosition,
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
        onClick: cellClickHandler(dispatch, patternId),
        patternData,
        yLabel: yLabel(selectedScale, yLength, rootNote),
      }} />
      <ButtonPlay {...{
        onPlay: () => {
          dispatch(setPatternPlaying({patternId, value: true}))
          setTimeout(this.onPlay.bind(this))
        },
        onStop: () => {
          dispatch(setPatternPlaying({patternId, value: false}))
          this.onStop()
        },
        playing,
      }} />
      <nav>
        <ButtonPrimary to={`/controllers/pattern/${patternId}/settings`}>
          Options
        </ButtonPrimary>
      </nav>
    </div>
  }
})
