import test from 'tape'
import reducer from './song'
import {
  patternDelete,
  songActiveNotesSet,
  songMarkerPositionSet,
  songPlayingStart,
  songPlayingStop,
  songStepsAdd,
  songStepsRemove,
} from '../actions'

const reducerName = 'song reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {
    activeNotes: [],
    isPlaying: false,
    markerPosition: 0,
    playStartTime: null,
    steps: [
      {patternId: 0, x: 0, y: 0},
      {patternId: 0, x: 1, y: 0},
      {patternId: 0, x: 2, y: 0},
      {patternId: 0, x: 3, y: 0},
      {patternId: 0, x: 4, y: 0},
      {patternId: 0, x: 5, y: 0},
      {patternId: 0, x: 6, y: 0},
      {patternId: 0, x: 7, y: 0},
      {patternId: 1, x: 0, y: 1},
      {patternId: 1, x: 1, y: 1},
      {patternId: 1, x: 2, y: 1},
      {patternId: 1, x: 3, y: 1},
      {patternId: 1, x: 4, y: 1},
      {patternId: 1, x: 5, y: 1},
      {patternId: 1, x: 6, y: 1},
      {patternId: 1, x: 7, y: 1},
    ],
    xLength: 8,
  })
  t.end()
})

test(`${reducerName} patternDelete`, t => {
  t.deepEqual(
    reducer({steps: [{patternId: 0}, {patternId: 1}, {patternId: 2}]}, patternDelete(1)),
    {steps: [{patternId: 0}, {patternId: 2}]}
  )
  t.end()
})

test(`${reducerName} songActiveNotesSet`, t => {
  t.deepEqual(
    reducer({activeNotes: []}, songActiveNotesSet(['note0', 'note1', 'note2'])),
    {activeNotes: ['note0', 'note1', 'note2']}
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
    reducer({activeNotes: [1, 2, 3], isPlaying: true, markerPosition: 0.2, playStartTime: 10}, songPlayingStop()),
    {activeNotes: [], isPlaying: false, markerPosition: 0, playStartTime: null}
  )
  t.end()
})

test(`${reducerName} songStepsAdd`, t => {
  t.deepEqual(
    reducer({steps: [{patternId: 0, x: 0, y: 0}]}, songStepsAdd({patternId: 5, x: 5})),
    {steps: [{patternId: 0, x: 0, y: 0}, {patternId: 5, x: 5, y: 5}]}
  )
  t.end()
})

test(`${reducerName} songStepsRemove`, t => {
  t.deepEqual(
    reducer({steps: [{patternId: 0, x: 0, y: 0}, {patternId: 5, x: 5, y: 5}]}, songStepsRemove({patternId: 5, x: 5})),
    {steps: [{patternId: 0, x: 0, y: 0}]}
  )
  t.end()
})
