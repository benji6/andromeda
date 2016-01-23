import test from 'tape'
import reducer, {initialState} from './song'
import {updateSongNotes} from '../actions'

test('song reducer returns initial state', t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test('song reducer updates state', t => {
  const newNotes = Array.from({length: 8}, (x, i) => i)
  t.deepEqual(reducer(undefined, updateSongNotes(newNotes)),
              {...initialState, notes: newNotes})
  t.end()
})
