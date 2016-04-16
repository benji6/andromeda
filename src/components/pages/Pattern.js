import {
  compose,
  curry,
  curryN,
  filter,
  map,
  range,
  repeat
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import {
  patternCellClick,
  setPatternActivePosition
} from '../../actions'
import {mapIndexed} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'
import PlayButton from '../atoms/PlayButton'
import Pattern from '../organisms/Pattern'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../../audioHelpers/pitchFromScaleIndex'
import noteNameFromPitch from '../../audioHelpers/noteNameFromPitch'
import {stepExists} from '../../reducers/patterns'
import {instrumentInstance} from '../../utils/derivedData'
import store from '../../store'
import scales from '../../constants/scales'

const yLabel = curry(
  (selectedScale, yLength, rootNote, octave, i) => noteNameFromPitch(pitchFromScaleIndex(
    scales[selectedScale],
    yLength - i - 1
  ) + rootNote + 12 * octave)
)

const cellClickHandler = curryN(5, (dispatch, patternId, y, x) =>
  dispatch(patternCellClick({patternId, x, y})))

const emptyPatternData = defaultMemoize((xLength, yLength) =>
  map(range(0), repeat(xLength, yLength)))

const connectComponent = connect(({
  activePatternIndex,
  dispatch,
  patterns,
  plugins,
  settings: {bpm, rootNote, selectedScale},
}, {params: {patternId}}) => {
  const {
    activeNotes,
    activePosition,
    instrument,
    octave,
    playing,
    steps,
    volume,
    xLength,
    yLength,
  } = patterns[patternId]

  const patternData = mapIndexed(
    (x, rowIndex) => map(colIndex => ({
      active: colIndex === activePosition,
      selected: stepExists(colIndex, rowIndex, steps)
    }), x),
    emptyPatternData(xLength, yLength)
  )

  return {
    activeNotes,
    bpm,
    dispatch,
    instrument,
    octave,
    patternData,
    patternId: Number(patternId),
    playing,
    plugins,
    rootNote,
    selectedScale,
    steps,
    volume,
    xLength,
    yLength,
  }
})

export default connectComponent(class extends React.Component {
  onPlay () {
    let count = 0
    const {patternId} = this.props

    const timeoutCallback = _ => {
      const state = store.getState()
      const {
        activeNotes,
        instrument,
        octave,
        playing,
        steps,
        volume,
        xLength,
        yLength,
      } = state.patterns[patternId]

      if (playing !== true) return

      const {settings: {bpm, rootNote, selectedScale}} = state

      const position = count % xLength
      this.props.dispatch(setPatternActivePosition({patternId, value: position}))
      activeNotes.forEach(({id, instrumentObj}) => instrumentObj.noteStop &&
        instrumentObj.noteStop(id))
      activeNotes.clear()

      compose(
        map(({x, y}) => {
          const {plugins} = this.props
          const id = `pattern-${patternId}-${x}-${y}`
          const instrumentObj = instrumentInstance(instrument, plugins)
          activeNotes.add({instrumentObj, id})
          instrumentObj.noteStart({
            frequency: pitchToFrequency(pitchFromScaleIndex(
              scales[selectedScale],
              yLength - 1 - y + scales[selectedScale].length * octave
            ) + rootNote),
            gain: volume,
            id
          })
        }),
        filter(({x}) => x === position)
      )(steps)

      count++
      setTimeout(timeoutCallback, 60000 / bpm)
    }
    timeoutCallback()
  }

  onStop () {
    this.stopAudio()
    this.stopVisuals()
  }

  stopAudio () {
    const {activeNotes} = this.props
    activeNotes.forEach(({id, instrumentObj}) => instrumentObj.noteStop &&
      instrumentObj.noteStop(id))
    activeNotes.clear()
  }

  stopVisuals () {
    this.props.dispatch(setPatternActivePosition({
      patternId: this.props.patternId,
      value: null
    }))
  }

  render () {
    const {
      dispatch,
      octave,
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
        onClick: cellClickHandler(dispatch, patternId),
        patternData,
        yLabel: yLabel(selectedScale, yLength, rootNote, octave),
      }} />
      <PlayButton {...{
        dispatch,
        onPlay: ::this.onPlay,
        onStop: ::this.onStop,
        patternId,
        playing,
      }} />
      <nav>
        <FullButton to={`/controllers/pattern/${patternId}/settings`}>
          Options
        </FullButton>
      </nav>
    </div>
  }
})
