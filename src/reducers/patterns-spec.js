import 'web-audio-test-api'
import test from 'tape'
import reducer, {initialState} from './patterns'
import {
  activePatternCellClick,
  setActivePatternActivePosition,
  setActivePatternYLength,
  updateActivePatternInstrument,
  updateActivePatternOctave,
  updateActivePatternVolume,
  updateActivePatternXLength
} from '../actions'

const reducerName = 'patterns'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} reducer handles active pattern cell click`, t => {
  const activePatternIndex = 0
  const activePattern = initialState[activePatternIndex]
  const payload = {x: 1, y: 2}
  const testState = [...initialState.slice(0, activePatternIndex),
                     {...activePattern, steps: [payload]},
                     ...initialState.slice(activePatternIndex + 1)]
  t.deepEqual(reducer(undefined, activePatternCellClick(payload)),
              testState)
  t.deepEqual(reducer(testState, activePatternCellClick(payload)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, steps: []},
               ...initialState.slice(activePatternIndex + 1)])
  t.end()
})

test(`${reducerName} reducer updates active pattern active position`, t => {
  const activePatternIndex = 0
  const activePattern = initialState[activePatternIndex]
  const payload = 3

  t.deepEqual(reducer(undefined, setActivePatternActivePosition(payload)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, activePosition: payload},
               ...initialState.slice(activePatternIndex + 1)])
  t.end()
})

test(`${reducerName} reducer setActivePatternYLength`, t => {
  t.deepEqual(reducer([{
    activePosition: null,
    instrument: 'Prometheus',
    steps: [],
    octave: 0,
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  }], setActivePatternYLength(10)), [{
    activePosition: null,
    instrument: 'Prometheus',
    steps: [],
    octave: 0,
    xLength: 8,
    yLength: 10,
    volume: 1 / 3
  }])
  t.end()
})

test(`${reducerName} reducer updateActivePatternInstrument`, t => {
  const activePatternIndex = 0
  const activePattern = initialState[activePatternIndex]
  const payload = 3

  t.deepEqual(reducer(undefined, updateActivePatternInstrument(payload)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, instrument: payload},
               ...initialState.slice(activePatternIndex + 1)])
  t.end()
})

test(`${reducerName} reducer updates active pattern octave`, t => {
  const activePatternIndex = 0
  const activePattern = initialState[activePatternIndex]
  const payload = 5

  t.deepEqual(reducer(undefined, updateActivePatternOctave(payload)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, octave: payload},
               ...initialState.slice(activePatternIndex + 1)])
  t.end()
})

test(`${reducerName} reducer updates active pattern xLength`, t => {
  const activePatternIndex = 0
  const activePattern = initialState[activePatternIndex]
  const payload = 5

  t.deepEqual(reducer(undefined, updateActivePatternXLength(payload)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, xLength: payload},
               ...initialState.slice(activePatternIndex + 1)])
  t.end()
})

test(`${reducerName} reducer updateActivePatternVolume`, t => {
  const activePatternIndex = 0
  const activePattern = initialState[activePatternIndex]
  const payload = 0.42

  t.deepEqual(reducer(undefined, updateActivePatternVolume(payload)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, volume: payload},
               ...initialState.slice(activePatternIndex + 1)])
  t.end()
})
