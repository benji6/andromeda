import test from 'tape'
import reducer from './song'
import {
  patternBeatDelete,
  patternSynthDelete,
  songMarkerPositionSet,
  songPlayingStart,
  songPlayingStop,
  songStepsAdd,
  songStepsRemove,
} from '../actions'

const reducerName = 'song reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {
    isPlaying: false,
    markerPosition: 0,
    playStartTime: null,
    steps: [
      {patternId: 0, patternType: 'beat', x: 0},
      {patternId: 0, patternType: 'beat', x: 1},
      {patternId: 0, patternType: 'beat', x: 2},
      {patternId: 0, patternType: 'beat', x: 3},
      {patternId: 0, patternType: 'beat', x: 4},
      {patternId: 0, patternType: 'beat', x: 5},
      {patternId: 0, patternType: 'beat', x: 6},
      {patternId: 0, patternType: 'beat', x: 7},
      {patternId: 0, patternType: 'synth', x: 0},
      {patternId: 0, patternType: 'synth', x: 1},
      {patternId: 0, patternType: 'synth', x: 2},
      {patternId: 0, patternType: 'synth', x: 3},
      {patternId: 0, patternType: 'synth', x: 4},
      {patternId: 0, patternType: 'synth', x: 5},
      {patternId: 0, patternType: 'synth', x: 6},
      {patternId: 0, patternType: 'synth', x: 7},
    ],
    xLength: 8,
  })
  t.end()
})

test(`${reducerName} patternBeatDelete`, t => {
  t.deepEqual(
    reducer({steps: [
      {patternId: 0, patternType: 'synth'},
      {patternId: 0, patternType: 'beat'},
      {patternId: 1, patternType: 'beat'},
    ]}, patternBeatDelete(0)),
    {steps: [
      {patternId: 0, patternType: 'synth'},
      {patternId: 1, patternType: 'beat'},
    ]}
  )
  t.end()
})

test(`${reducerName} patternSynthDelete`, t => {
  t.deepEqual(
    reducer({steps: [
      {patternId: 0, patternType: 'beat'},
      {patternId: 0, patternType: 'synth'},
      {patternId: 1, patternType: 'synth'},
    ]}, patternSynthDelete(0)),
    {steps: [
      {patternId: 0, patternType: 'beat'},
      {patternId: 1, patternType: 'synth'},
    ]}
  )
  t.end()
})

test(`${reducerName} songMarkerPositionSet`, t => {
  t.deepEqual(
    reducer({markerPosition: 0.2}, songMarkerPositionSet(0.3)),
    {markerPosition: 0.3}
  )
  t.end()
})

test(`${reducerName} songPlayingStart`, t => {
  t.deepEqual(
    reducer({isPlaying: false, playStartTime: null}, songPlayingStart(5)),
    {isPlaying: true, playStartTime: 5}
  )
  t.end()
})

test(`${reducerName} songPlayingStop`, t => {
  t.deepEqual(
    reducer({isPlaying: true, markerPosition: 0.2, playStartTime: 10}, songPlayingStop()),
    {isPlaying: false, markerPosition: 0, playStartTime: null}
  )
  t.end()
})

test(`${reducerName} songStepsAdd`, t => {
  t.deepEqual(
    reducer({steps: [{patternId: 0, patternType: 'synth', x: 0}]}, songStepsAdd({patternId: 5, patternType: 'beat', x: 5})),
    {steps: [{patternId: 0, patternType: 'synth', x: 0}, {patternId: 5, patternType: 'beat', x: 5}]}
  )
  t.end()
})

test(`${reducerName} songStepsRemove`, t => {
  t.deepEqual(
    reducer({steps: [{patternId: 5, patternType: 'beat', x: 0}, {patternId: 5, patternType: 'synth', x: 0}]}, songStepsRemove({patternId: 5, patternType: 'beat', x: 0})),
    {steps: [{patternId: 5, patternType: 'synth', x: 0}]}
  )
  t.end()
})
