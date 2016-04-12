import 'web-audio-test-api'
import test from 'tape'
import reducer, {initialState} from './patterns'
import {
  addNewPattern,
  deletePattern,
  patternCellClick,
  setPatternActivePosition,
  setPatternPlaying,
  setPatternYLength,
  updatePatternInstrument,
  updatePatternOctave,
  updatePatternVolume,
  updatePatternXLength
} from '../actions'

const reducerName = 'patterns reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} addNewPattern`, t => {
  t.deepEqual(reducer([{
    activeNotes: new Set(),
    activePosition: null,
    instrument: 'Prometheus',
    steps: [],
    octave: 0,
    playing: false,
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  }], addNewPattern()), [{
    activeNotes: new Set(),
    activePosition: null,
    instrument: 'Prometheus',
    steps: [],
    octave: 0,
    playing: false,
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  },
  {
    activeNotes: new Set(),
    activePosition: null,
    instrument: 'Prometheus',
    steps: [],
    octave: 0,
    playing: false,
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  }])
  t.end()
})

test(`${reducerName} deletePattern`, t => {
  t.deepEqual(reducer([{
    activePosition: null,
    instrument: 'instrument 0',
    steps: []
  },
  {
    activePosition: null,
    instrument: 'instrument 1',
    steps: []
  },
  {
    activePosition: null,
    instrument: 'instrument 2',
    steps: []
  }], deletePattern(1)), [{
    activePosition: null,
    instrument: 'instrument 0',
    steps: []
  },
  {
    activePosition: null,
    instrument: 'instrument 2',
    steps: []
  }])
  t.end()
})

test(`${reducerName} patternCellClick`, t => {
  const payload = {patternId: 0, x: 1, y: 2}
  t.deepEqual(reducer([{
    instrument: 'Prometheus',
    steps: []
  }], patternCellClick(payload)), [{
    instrument: 'Prometheus',
    steps: [{x: 1, y: 2}]
  }])
  t.deepEqual(reducer([{
    instrument: 'Prometheus',
    steps: [{x: 1, y: 2}]
  }], patternCellClick(payload)), [{
    instrument: 'Prometheus',
    steps: []
  }])
  t.end()
})

test(`${reducerName} setPatternActivePosition`, t => {
  const patternId = 0
  const activePattern = initialState[patternId]
  const payload = {patternId, value: 3}

  t.deepEqual(reducer(undefined, setPatternActivePosition(payload)),
              [...initialState.slice(0, patternId),
               {...activePattern, activePosition: payload.value},
               ...initialState.slice(patternId + 1)])
  t.end()
})

test(`${reducerName} setPatternPlaying`, t => {
  t.deepEqual(reducer([{
    activePosition: null,
    instrument: 'Prometheus',
    playing: false,
    steps: [],
    octave: 0,
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  }], setPatternPlaying({patternId: 0, value: true})), [{
    activePosition: null,
    instrument: 'Prometheus',
    steps: [],
    octave: 0,
    playing: true,
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  }])
  t.end()
})

test(`${reducerName} setPatternYLength`, t => {
  t.deepEqual(reducer([{
    activePosition: null,
    instrument: 'Prometheus',
    steps: [],
    octave: 0,
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  }], setPatternYLength({patternId: 0, value: 10})), [{
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

test(`${reducerName} updatePatternInstrument`, t => {
  const patternId = 0
  const activePattern = initialState[patternId]
  const payload = {patternId, value: 'test instrument'}

  t.deepEqual(reducer(undefined, updatePatternInstrument(payload)),
              [...initialState.slice(0, patternId),
               {...activePattern, instrument: payload.value},
               ...initialState.slice(patternId + 1)])
  t.end()
})

test(`${reducerName} updatePatternOctave`, t => {
  const patternId = 0
  const activePattern = initialState[patternId]
  const payload = {patternId, value: 5}

  t.deepEqual(reducer(undefined, updatePatternOctave(payload)),
              [...initialState.slice(0, patternId),
               {...activePattern, octave: payload.value},
               ...initialState.slice(patternId + 1)])
  t.end()
})

test(`${reducerName} updatePatternXLength`, t => {
  const patternId = 0
  const activePattern = initialState[patternId]
  const payload = {patternId, value: 5}

  t.deepEqual(reducer(undefined, updatePatternXLength(payload)),
              [...initialState.slice(0, patternId),
               {...activePattern, xLength: payload.value},
               ...initialState.slice(patternId + 1)])
  t.end()
})

test(`${reducerName} updatePatternVolume`, t => {
  const patternId = 0
  const activePattern = initialState[patternId]
  const payload = {patternId, value: 0.42}

  t.deepEqual(reducer(undefined, updatePatternVolume(payload)),
              [...initialState.slice(0, patternId),
               {...activePattern, volume: payload.value},
               ...initialState.slice(patternId + 1)])
  t.end()
})
