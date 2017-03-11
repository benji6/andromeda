import 'web-audio-test-api'
import {REHYDRATE} from 'redux-persist/constants'
import test from 'tape'
import reducer, {initialState} from './patternsSynth'
import {
  patternSynthAdd,
  patternSynthStepsRemove,
  patternSynthDelete,
  patternSynthInstrumentSet,
  patternSynthMarkerPositionSet,
  patternSynthPlayingStart,
  patternSynthPlayingStop,
  patternSynthStepsAdd,
  patternSynthStepVelocitySet,
  songPlayingStart,
} from '../actions'

const reducerName = 'patternsSynth reducer'

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
  }], {payload: {}, type: REHYDRATE}), [
    {
      id: 0,
      instrument: 'Prometheus',
      playing: false,
      steps: [],
      xLength: 8,
      yLength: 24,
    },
  ])
  t.deepEqual(reducer([{
    id: 0,
    instrument: 'Prometheus',
    playing: false,
    steps: [],
    xLength: 8,
    yLength: 24,
  }], {payload: {patternsSynth: [{id: 0, steps: [1]}, {id: 1, steps: [2, 3]}]}, type: REHYDRATE}), [
    {
      id: 0,
      instrument: 'Prometheus',
      markerPosition: 0,
      playing: false,
      playStartTime: null,
      steps: [1],
      stepVelocity: 1,
      xLength: 8,
      yLength: 16,
    },
    {
      id: 1,
      instrument: 'Prometheus',
      markerPosition: 0,
      playing: false,
      playStartTime: null,
      steps: [2, 3],
      stepVelocity: 1,
      xLength: 8,
      yLength: 16,
    },
  ])
  t.end()
})

test(`${reducerName} patternSynthDelete`, t => {
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
  }], patternSynthDelete(4)), [{
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
    xLength: 8,
    yLength: 8,
  }], patternSynthPlayingStart({currentTime: 150, patternId: 0})), [{
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

test(`${reducerName} patternSynthPlayingStop`, t => {
  t.deepEqual(reducer([{
    id: 0,
    markerPosition: 0.5,
    playing: true,
  }], patternSynthPlayingStop(0)), [{
    id: 0,
    markerPosition: 0,
    playing: false,
  }])
  t.end()
})

test(`${reducerName} patternSynthStepsAdd`, t => {
  t.deepEqual(reducer([{
    id: 0,
    steps: [{velocity: 0.4, x: 4, y: 3}],
    stepVelocity: 0.2,
  }], patternSynthStepsAdd({patternId: 0, x: 5, y: 3})), [{
    id: 0,
    steps: [{velocity: 0.4, x: 4, y: 3}, {velocity: 0.2, x: 5, y: 3}],
    stepVelocity: 0.2,
  }])
  t.end()
})

test(`${reducerName} patternSynthMarkerPositionSet`, t => {
  t.deepEqual(
    reducer(
      [{id: 0, markerPosition: 0.1}],
      patternSynthMarkerPositionSet({patternId: 0, value: 0.4})
    ),
    [{id: 0, markerPosition: 0.4}]
  )
  t.end()
})

test(`${reducerName} patternSynthInstrumentSet`, t => {
  t.deepEqual(
    reducer(
      [{id: 0, instrument: 'old instrument'}],
      patternSynthInstrumentSet({patternId: 0, value: 'new instrument'})
    ),
    [{id: 0, instrument: 'new instrument'}]
  )
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
        xLength: 8,
        yLength: 24,
      },
      {
        id: 1,
        instrument: 'Prometheus',
        markerPosition: 0,
        playing: false,
        playStartTime: null,
        steps: [],
        stepVelocity: 1,
        xLength: 8,
        yLength: 16,
      },
    ]
  )
  t.end()
})

test(`${reducerName} patternSynthStepVelocitySet`, t => {
  t.deepEqual(
    reducer(
      [{
        id: 0,
        stepVelocity: 0,
      }],
      patternSynthStepVelocitySet({patternId: 0, value: 1})
    ),
    [{
      id: 0,
      stepVelocity: 1,
    }],
  )
  t.end()
})

test(`${reducerName} patternSynthStepsRemove`, t => {
  t.deepEqual(reducer([{
    id: 0,
    steps: [{x: 0, y: 0}],
  }], patternSynthStepsRemove({patternId: 0, x: 0, y: 0})), [{
    id: 0,
    steps: [],
  }])
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
