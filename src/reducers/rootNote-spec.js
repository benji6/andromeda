import test from 'tape'
import reducer from './rootNote'
import {updateRootNote} from '../actions'

test('rootNote reducer returns initial state', t => {
  t.deepEqual(reducer(undefined, {}), 0)
  t.deepEqual(reducer(undefined, {}), 0)
  t.end()
})

test('rootNote reducer updates root note', t => {
  t.deepEqual(reducer(undefined, updateRootNote(3)), 3)
  t.end()
})
