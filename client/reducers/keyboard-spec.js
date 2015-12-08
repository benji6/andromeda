import test from 'tape'
import reducer, {initialState} from './keyboard'
import {
  updateKeyboardInstrument,
  updateKeyboardOctave,
} from '../actions'

const reducerName = 'keyboard'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} reducer updateKeyboardInstrument`, t => {
  t.deepEqual(reducer(undefined, updateKeyboardInstrument('piano')),
              {...initialState, instrument: 'piano'})
  t.deepEqual(reducer(undefined, updateKeyboardInstrument('tuba')),
              {...initialState, instrument: 'tuba'})
  t.end()
})

test(`${reducerName} reducer updateKeyboardOctave`, t => {
  t.deepEqual(reducer(undefined, updateKeyboardOctave(1)),
              {...initialState, octave: 1})
  t.deepEqual(reducer(undefined, updateKeyboardOctave(-1)),
              {...initialState, octave: -1})
  t.end()
})
