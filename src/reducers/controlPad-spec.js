import test from 'tape'
import reducer, {initialState} from './controlPad'
import {
  controlPadInstrumentSet,
  controlPadNoScaleSet,
  controlPadOctaveSet,
  controlPadPortamentoSet,
  controlPadRangeSet,
  controlPadTouched,
} from '../actions'

const reducerName = 'controlPad reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(
    reducer(undefined, {}),
    {
      instrument: 'Ariadne',
      noScale: false,
      octave: 0,
      portamento: false,
      range: 1,
      touched: false,
    }
  )
  t.end()
})

test(`${reducerName} controlPadTouched`, t => {
  t.deepEqual(
    reducer({touched: false}, controlPadTouched()),
    {touched: true}
  )
  t.end()
})

test(`${reducerName} updateControlPadChannel`, t => {
  const testVal = 'piano'
  t.deepEqual(reducer(undefined, controlPadInstrumentSet(testVal)),
              {...initialState, instrument: testVal})
  t.end()
})

test(`${reducerName} controlPadPortamentoSet`, t => {
  t.deepEqual(reducer(undefined, controlPadPortamentoSet(true)),
              {...initialState, portamento: true})
  t.deepEqual(reducer(undefined, controlPadPortamentoSet(false)),
              {...initialState, portamento: false})
  t.end()
})

test(`${reducerName} controlPadOctaveSet`, t => {
  t.deepEqual(reducer(undefined, controlPadOctaveSet(3)),
              {...initialState, octave: 3})
  t.deepEqual(reducer(undefined, controlPadOctaveSet(-1)),
              {...initialState, octave: -1})
  t.end()
})

test(`${reducerName} updateControlNoScale`, t => {
  t.deepEqual(reducer(undefined, controlPadNoScaleSet(false)),
              {...initialState, noScale: false})
  t.deepEqual(reducer(undefined, controlPadNoScaleSet(true)),
              {...initialState, noScale: true})
  t.end()
})

test(`${reducerName} controlPadRangeSet`, t => {
  t.deepEqual(reducer(undefined, controlPadRangeSet(2)),
              {...initialState, range: 2})
  t.deepEqual(reducer(undefined, controlPadRangeSet(3)),
              {...initialState, range: 3})
  t.end()
})
