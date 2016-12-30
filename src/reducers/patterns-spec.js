import 'web-audio-test-api'
import test from 'tape'
import reducer, {initialState} from './patterns'
import {
  patternActiveNotesSet,
  patternBeatAdd,
  patternBeatPlayingStart,
  patternBeatPlayingStop,
  patternDelete,
  patternInstrumentSet,
  patternMarkerPositionSet,
  patternNextLoopEndTimeSet,
  patternSynthAdd,
  patternSynthPlayingStart,
  patternSynthPlayingStop,
  patternVolumeSet,
  songPlayingStart,
} from '../actions'

const reducerName = 'patterns reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(
    reducer(undefined, {}),
    initialState
  )
  t.end()
})

test(`${reducerName} patternActiveNotesSet`, t => {
  t.deepEqual(reducer([{
    activeNotes: [13, 14],
    id: 0,
    instrument: 'Prometheus',
  }], patternActiveNotesSet({patternId: 0, value: [1, 2]})), [{
    activeNotes: [1, 2],
    id: 0,
    instrument: 'Prometheus',
  }])
  t.end()
})

test(`${reducerName} patternBeatAdd`, t => {
  t.deepEqual(reducer([{
    id: 0,
    instrument: 'Prometheus',
    playing: false,
    steps: [],
    volume: 1 / 3,
    xLength: 8,
    yLength: 24,
  }], patternBeatAdd()), [
    {
      id: 0,
      instrument: 'Prometheus',
      playing: false,
      steps: [],
      volume: 1 / 3,
      xLength: 8,
      yLength: 24,
    },
    {
      beatPattern: true,
      id: 1,
      markerPosition: 0,
      playing: false,
      playStartTime: null,
      steps: [],
      volume: 0.5,
      xLength: 8,
      yLength: 15,
    },
  ])
  t.end()
})

test(`${reducerName} patternBeatPlayingStart`, t => {
  t.deepEqual(reducer([{
    id: 0,
    instrument: 'Prometheus',
    playing: false,
    playStartTime: 100,
    steps: [],
    volume: 1 / 3,
    xLength: 8,
    yLength: 8,
  }], patternBeatPlayingStart({currentTime: 150, patternId: 0})), [{
    id: 0,
    instrument: 'Prometheus',
    playing: true,
    playStartTime: 150,
    steps: [],
    volume: 1 / 3,
    xLength: 8,
    yLength: 8,
  }])
  t.end()
})

test(`${reducerName} patternBeatPlayingStop`, t => {
  t.deepEqual(reducer([{
    activeNotes: [1, 2, 3],
    id: 0,
    markerPosition: 0.5,
    playing: true,
  }], patternBeatPlayingStop(0)), [{
    activeNotes: [],
    id: 0,
    markerPosition: 0,
    playing: false,
  }])
  t.end()
})

test(`${reducerName} patternDelete`, t => {
  t.deepEqual(reducer([{
    id: 2,
    instrument: 'instrument 0',
    steps: [],
  },
  {
    id: 4,
    instrument: 'instrument 1',
    steps: [],
  },
  {
    id: 6,
    instrument: 'instrument 2',
    steps: [],
  }], patternDelete(4)), [{
    id: 2,
    instrument: 'instrument 0',
    steps: [],
  },
  {
    id: 6,
    instrument: 'instrument 2',
    steps: [],
  }])
  t.end()
})

test(`${reducerName} patternSynthPlayingStart`, t => {
  t.deepEqual(reducer([{
    id: 0,
    instrument: 'Prometheus',
    playing: false,
    playStartTime: 100,
    steps: [],
    volume: 1 / 3,
    xLength: 8,
    yLength: 8,
  }], patternSynthPlayingStart({currentTime: 150, patternId: 0})), [{
    id: 0,
    instrument: 'Prometheus',
    playing: true,
    playStartTime: 150,
    steps: [],
    volume: 1 / 3,
    xLength: 8,
    yLength: 8,
  }])
  t.end()
})

test(`${reducerName} patternSynthPlayingStop`, t => {
  t.deepEqual(reducer([{
    activeNotes: [1, 2, 3],
    id: 0,
    markerPosition: 0.5,
    playing: true,
  }], patternSynthPlayingStop(0)), [{
    activeNotes: [],
    id: 0,
    markerPosition: 0,
    playing: false,
  }])
  t.end()
})

test(`${reducerName} patternSynthAdd`, t => {
  t.deepEqual(
    reducer(
      [{
        id: 0,
        instrument: 'Prometheus',
        playing: false,
        steps: [],
        volume: 1 / 3,
        xLength: 8,
        yLength: 24,
      }],
      patternSynthAdd()
    ),
    [
      {
        id: 0,
        instrument: 'Prometheus',
        playing: false,
        steps: [],
        volume: 1 / 3,
        xLength: 8,
        yLength: 24,
      },
      {
        activeNotes: [],
        id: 1,
        instrument: 'Prometheus',
        markerPosition: 0,
        playing: false,
        playStartTime: null,
        steps: [],
        synthPattern: true,
        volume: 1 / 3,
        xLength: 8,
        yLength: 16,
      },
    ]
  )
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
      [{id: 0, instrument: 'old instrument'}],
      patternInstrumentSet({patternId: 0, value: 'new instrument'})
    ),
    [{id: 0, instrument: 'new instrument'}]
  )
  t.end()
})

test(`${reducerName} patternVolumeSet`, t => {
  t.deepEqual(
    reducer(
      [{id: 0, volume: 7}],
      patternVolumeSet({patternId: 0, value: 12})
    ),
    [{id: 0, volume: 12}]
  )
  t.end()
})

test(`${reducerName} songPlayingStart`, t => {
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
  ], songPlayingStart()), [
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
