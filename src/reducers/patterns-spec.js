import 'web-audio-test-api'
import test from 'tape'
import reducer from './patterns'
import {
  patternActiveNotesAppend,
  patternActiveNotesReject,
  patternActiveNotesSet,
  patternBeatAdd,
  patternBeatPlayingStart,
  patternBeatPlayingStop,
  patternCellClick,
  patternDelete,
  patternInstrumentSet,
  patternMarkerPositionSet,
  patternNextLoopEndTimeSet,
  patternsAllPlayingStop,
  patternSynthAdd,
  patternSynthPlayingStart,
  patternSynthPlayingStop,
  patternVolumeSet,
  patternXLengthSet,
} from '../actions'

const reducerName = 'patterns reducer'
const initialState = [{
  activeNotes: [],
  instrument: 'Prometheus',
  steps: [],
  markerPosition: 0,
  playing: false,
  playStartTime: null,
  synthPattern: true,
  xLength: 8,
  yLength: 16,
  volume: 1 / 3
}]

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} patternActiveNotesAppend`, t => {
  t.deepEqual(reducer([{
    activeNotes: [{b: 'note'}],
    instrument: 'Prometheus',
  }], patternActiveNotesAppend({patternId: 0, value: {a: 'note'}})), [{
    activeNotes: [{b: 'note'}, {a: 'note'}],
    instrument: 'Prometheus',
  }])
  t.end()
})

test(`${reducerName} patternActiveNotesReject`, t => {
  t.deepEqual(reducer([{
    activeNotes: [13, 14],
    instrument: 'Prometheus',
  }], patternActiveNotesReject({patternId: 0, value: x => x === 13})), [{
    activeNotes: [14],
    instrument: 'Prometheus',
  }])
  t.end()
})

test(`${reducerName} patternActiveNotesSet`, t => {
  t.deepEqual(reducer([{
    activeNotes: [13, 14],
    instrument: 'Prometheus',
  }], patternActiveNotesSet({patternId: 0, value: [1, 2]})), [{
    activeNotes: [1, 2],
    instrument: 'Prometheus',
  }])
  t.end()
})

test(`${reducerName} patternBeatAdd`, t => {
  t.deepEqual(reducer([{
    instrument: 'Prometheus',
    steps: [],
    playing: false,
    xLength: 8,
    yLength: 24,
    volume: 1 / 3
  }], patternBeatAdd()), [
    {
      instrument: 'Prometheus',
      steps: [],
      playing: false,
      xLength: 8,
      yLength: 24,
      volume: 1 / 3
    },
    {
      activeNotes: [],
      beatPattern: true,
      instrument: 'Prometheus',
      steps: [],
      markerPosition: 0,
      playing: false,
      playStartTime: null,
      xLength: 8,
      yLength: 15,
      volume: 1 / 3
    }
  ])
  t.end()
})

test(`${reducerName} patternBeatPlayingStart`, t => {
  t.deepEqual(reducer([{
    instrument: 'Prometheus',
    playing: false,
    playStartTime: 100,
    steps: [],
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  }], patternBeatPlayingStart({patternId: 0, currentTime: 150})), [{
    instrument: 'Prometheus',
    steps: [],
    playing: true,
    playStartTime: 150,
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  }])
  t.end()
})

test(`${reducerName} patternBeatPlayingStop`, t => {
  t.deepEqual(reducer([{
    activeNotes: [1, 2, 3],
    markerPosition: 0.5,
    playing: true,
  }], patternBeatPlayingStop(0)), [{
    activeNotes: [],
    markerPosition: 0,
    playing: false,
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

test(`${reducerName} patternDelete`, t => {
  t.deepEqual(reducer([{
    instrument: 'instrument 0',
    steps: []
  },
  {
    instrument: 'instrument 1',
    steps: []
  },
  {
    instrument: 'instrument 2',
    steps: []
  }], patternDelete(1)), [{
    instrument: 'instrument 0',
    steps: []
  },
  {
    instrument: 'instrument 2',
    steps: []
  }])
  t.end()
})

test(`${reducerName} patternSynthPlayingStart`, t => {
  t.deepEqual(reducer([{
    instrument: 'Prometheus',
    playing: false,
    playStartTime: 100,
    steps: [],
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  }], patternSynthPlayingStart({patternId: 0, currentTime: 150})), [{
    instrument: 'Prometheus',
    steps: [],
    playing: true,
    playStartTime: 150,
    xLength: 8,
    yLength: 8,
    volume: 1 / 3
  }])
  t.end()
})

test(`${reducerName} patternSynthPlayingStop`, t => {
  t.deepEqual(reducer([{
    activeNotes: [1, 2, 3],
    markerPosition: 0.5,
    playing: true,
  }], patternSynthPlayingStop(0)), [{
    activeNotes: [],
    markerPosition: 0,
    playing: false,
  }])
  t.end()
})

test(`${reducerName} patternSynthAdd`, t => {
  t.deepEqual(reducer([{
    instrument: 'Prometheus',
    steps: [],
    playing: false,
    xLength: 8,
    yLength: 24,
    volume: 1 / 3
  }], patternSynthAdd()), [{
    instrument: 'Prometheus',
    steps: [],
    playing: false,
    xLength: 8,
    yLength: 24,
    volume: 1 / 3
  },
  initialState[0]])
  t.end()
})

test(`${reducerName} patternsAllPlayingStop`, t => {
  t.deepEqual(reducer([
    {
      activeNotes: [1, 2, 3],
      markerPosition: 0.5,
      playing: true,
    },
    {
      activeNotes: [1, 2, 3],
      markerPosition: 0.5,
      playing: true,
    },
], patternsAllPlayingStop()), [
  {
    activeNotes: [],
    markerPosition: 0,
    playing: false,
  },
  {
    activeNotes: [],
    markerPosition: 0,
    playing: false,
  },
])
  t.end()
})

test(`${reducerName} patternMarkerPositionSet`, t => {
  t.deepEqual(
    reducer(
      [{id: 0, markerPosition: 0.1}],
      patternMarkerPositionSet({patternId: 0, value: 0.4})
    ),
    [{id: 0, markerPosition: 0.4}]
  )
  t.end()
})

test(`${reducerName} patternNextLoopEndTimeSet`, t => {
  t.deepEqual(
    reducer(
      [{id: 0, nextLoopEndTime: 100}],
      patternNextLoopEndTimeSet({patternId: 0, value: 120})
    ),
    [{id: 0, nextLoopEndTime: 120}]
  )
  t.end()
})

test(`${reducerName} patternInstrumentSet`, t => {
  t.deepEqual(
    reducer(
      [{instrument: 'old instrument'}],
      patternInstrumentSet({patternId: 0, value: 'new instrument'})
    ),
    [{instrument: 'new instrument'}]
  )
  t.end()
})

test(`${reducerName} patternXLengthSet`, t => {
  t.deepEqual(
    reducer(
      [{xLength: 7}],
      patternXLengthSet({patternId: 0, value: 12})
    ),
    [{xLength: 12}]
  )
  t.end()
})

test(`${reducerName} patternVolumeSet`, t => {
  t.deepEqual(
    reducer(
      [{volume: 7}],
      patternVolumeSet({patternId: 0, value: 12})
    ),
    [{volume: 12}]
  )
  t.end()
})
