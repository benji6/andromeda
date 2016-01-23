import test from 'tape'
import reducer, {initialState} from './effects'
import {addEffect} from '../actions'

const reducerName = 'effect'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} reducer - adding an effect`, t => {
  t.deepEqual(reducer(undefined, addEffect('awesomeEffect')),
              [...initialState, 'awesomeEffect'])
  t.end()
})
