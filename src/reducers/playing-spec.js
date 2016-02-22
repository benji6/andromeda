import test from 'tape'
import reducer, {initialState} from './playing'
import {updatePlaying} from '../actions'

test('playing reducer returns initial state', t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test('playing reducer updates state', t => {
  t.false(reducer(undefined, updatePlaying(false)))
  t.end()
})
