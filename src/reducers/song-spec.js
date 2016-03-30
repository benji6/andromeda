import test from 'tape'
import reducer, {initialState} from './song'
import {setSongActivePosition} from '../actions'

const reducerName = 'song reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} setSongActivePosition`, t => {
  t.equal(reducer(undefined, setSongActivePosition(1)).activePosition, 1)
  t.equal(reducer(undefined, setSongActivePosition(2)).activePosition, 2)
  t.end()
})
