import test from 'tape'
import reducer, {initialState} from './bpm'
import {updateBpm} from '../actions'

const reducerName = 'bpm'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} reducer updateBpm`, t => {
  t.deepEqual(reducer(undefined, updateBpm(180)),
              180)
  t.end()
})
