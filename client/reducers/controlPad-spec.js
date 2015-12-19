import test from 'tape'
import reducer, {initialState} from './controlPad'
import {
  updateControlPadInstrument,
  updateControlPadNoScale,
  updateControlPadOctave,
  updateControlPadPortamento,
  updateControlPadRange
} from '../actions'

const reducerName = 'controlPad'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} reducer updateControlPadChannel`, t => {
  const testVal = 'piano'
  t.deepEqual(reducer(undefined, updateControlPadInstrument(testVal)),
              {...initialState, instrument: testVal})
  t.end()
})

test(`${reducerName} reducer updateControlPadPortamento`, t => {
  t.deepEqual(reducer(undefined, updateControlPadPortamento(true)),
              {...initialState, portamento: true})
  t.deepEqual(reducer(undefined, updateControlPadPortamento(false)),
              {...initialState, portamento: false})
  t.end()
})

test(`${reducerName} reducer updateControlPadOctave`, t => {
  t.deepEqual(reducer(undefined, updateControlPadOctave(3)),
              {...initialState, octave: 3})
  t.deepEqual(reducer(undefined, updateControlPadOctave(-1)),
              {...initialState, octave: -1})
  t.end()
})

test(`${reducerName} reducer updateControlNoScale`, t => {
  t.deepEqual(reducer(undefined, updateControlPadNoScale(false)),
              {...initialState, noScale: false})
  t.deepEqual(reducer(undefined, updateControlPadNoScale(true)),
              {...initialState, noScale: true})
  t.end()
})

test(`${reducerName} reducer updateControlPadRange`, t => {
  t.deepEqual(reducer(undefined, updateControlPadRange(2)),
              {...initialState, range: 2})
  t.deepEqual(reducer(undefined, updateControlPadRange(3)),
              {...initialState, range: 3})
  t.end()
})
