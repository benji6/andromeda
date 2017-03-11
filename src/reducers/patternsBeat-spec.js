import 'web-audio-test-api'
import test from 'tape'
import {REHYDRATE} from 'redux-persist/constants'
import reducer, {initialState} from './patternsBeat'
import {
  patternBeatAdd,
  patternBeatDelete,
  patternBeatMarkerPositionSet,
  patternBeatPlayingStart,
  patternBeatPlayingStop,
  patternBeatStepsAdd,
  patternBeatStepsRemove,
  patternBeatStepVelocitySet,
  songPlayingStart,
} from '../actions'

const reducerName = 'patternsBeat reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(
    reducer(undefined, {}),
    initialState
  )
  t.end()
})

test(`${reducerName} REHYDRATE`, t => {
  t.deepEqual(reducer([{
    id: 0,
    instrument: 'Prometheus',
    playing: false,
    steps: [],
    xLength: 8,
    yLength: 24,
  }], {payload: {}, type: REHYDRATE}), [{
    id: 0,
    instrument: 'Prometheus',
    playing: false,
    steps: [],
    xLength: 8,
    yLength: 24,
  }])
  t.deepEqual(reducer([{
    id: 0,
    instrument: 'Prometheus',
    playing: false,
    steps: [],
    xLength: 8,
    yLength: 24,
  }], {payload: {patternsBeat: [{id: 0, steps: [1]}, {id: 1, steps: [2, 3]}]}, type: REHYDRATE}), [
    {
      id: 0,
      markerPosition: 0,
      playing: false,
      playStartTime: null,
      steps: [1],
      stepVelocity: 1,
      xLength: 8,
      yLength: 15,
    },
    {id: 1,
      markerPosition: 0,
      playing: false,
      playStartTime: null,
      steps: [2, 3],
      stepVelocity: 1,
      xLength: 8,
      yLength: 15,
    },
  ])
  t.end()
})

test(`${reducerName} patternBeatAdd`, t => {
  t.deepEqual(reducer([{
    id: 0,
    instrument: 'Prometheus',
    playing: false,
    steps: [],
    xLength: 8,
    yLength: 24,
  }], patternBeatAdd()), [
    {
      id: 0,
      instrument: 'Prometheus',
      playing: false,
      steps: [],
      xLength: 8,
      yLength: 24,
    },
    {
      id: 1,
      markerPosition: 0,
      playing: false,
      playStartTime: null,
      steps: [],
      stepVelocity: 1,
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
    xLength: 8,
    yLength: 8,
  }], patternBeatPlayingStart({currentTime: 150, patternId: 0})), [{
    id: 0,
    instrument: 'Prometheus',
    playing: true,
    playStartTime: 150,
    steps: [],
    xLength: 8,
    yLength: 8,
  }])
  t.end()
})

test(`${reducerName} patternBeatPlayingStop`, t => {
  t.deepEqual(reducer([{
    id: 0,
    markerPosition: 0.5,
    playing: true,
  }], patternBeatPlayingStop(0)), [{
    id: 0,
    markerPosition: 0,
    playing: false,
  }])
  t.end()
})

test(`${reducerName} patternBeatStepsAdd`, t => {
  t.deepEqual(reducer([{
    id: 0,
    steps: [],
    stepVelocity: 1,
  }], patternBeatStepsAdd({patternId: 0, x: 0, y: 0})), [{
    id: 0,
    steps: [{velocity: 1, x: 0, y: 0}],
    stepVelocity: 1,
  }])
  t.end()
})

test(`${reducerName} patternBeatStepsRemove`, t => {
  t.deepEqual(reducer([{
    id: 0,
    steps: [{velocity: 1, x: 0, y: 0}],
  }], patternBeatStepsRemove({patternId: 0, x: 0, y: 0})), [{
    id: 0,
    steps: [],
  }])
  t.end()
})

test(`${reducerName} patternBeatDelete`, t => {
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
  }], patternBeatDelete(4)), [{
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

test(`${reducerName} patternBeatMarkerPositionSet`, t => {
  t.deepEqual(
    reducer(
      [{id: 0, markerPosition: 0.1}],
      patternBeatMarkerPositionSet({patternId: 0, value: 0.4})
    ),
    [{id: 0, markerPosition: 0.4}]
  )
  t.end()
})

test(`${reducerName} patternBeatStepVelocitySet`, t => {
  t.deepEqual(
    reducer(
      [{
        id: 0,
        stepVelocity: 0,
      }],
      patternBeatStepVelocitySet({patternId: 0, value: 1})
    ),
    [{
      id: 0,
      stepVelocity: 1,
    }],
  )
  t.end()
})

test(`${reducerName} songPlayingStart`, t => {
  t.deepEqual(reducer([
    {
      markerPosition: 0.5,
      playing: true,
    },
    {
      markerPosition: 0.5,
      playing: true,
    },
  ], songPlayingStart()), [
    {
      markerPosition: 0,
      playing: false,
    },
    {
      markerPosition: 0,
      playing: false,
    },
  ])
  t.end()
})
