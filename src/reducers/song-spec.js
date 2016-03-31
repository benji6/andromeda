import test from 'tape'
import reducer, {initialState} from './song'
import {setSongActivePosition, songCellClick} from '../actions'

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

test(`${reducerName} songCellClick`, t => {
  t.deepEqual(
    reducer({steps: []}, songCellClick({x: 1, y: 2})),
    {steps: [{x: 1, y: 2}]}
  )
  t.deepEqual(
    reducer({steps: [{x: 1, y: 2}]}, songCellClick({x: 1, y: 2})),
    {steps: []}
  )
  t.end()
})
