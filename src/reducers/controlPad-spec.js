import test from 'tape'
import reducer from './controlPad'
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
      isTouched: false,
      noScale: false,
      octave: 0,
      portamento: false,
      range: 1,
    }
  )
  t.end()
})

test(`${reducerName} controlPadTouched`, t => {
  t.deepEqual(reducer({isTouched: false}, controlPadTouched()), {isTouched: true})
  t.deepEqual(reducer({isTouched: true}, controlPadTouched()), {isTouched: true})
  t.end()
})

test(`${reducerName} updateControlPadChannel`, t => {
  const testVal = 'piano'
  t.deepEqual(reducer({instrument: 'foo'}, controlPadInstrumentSet(testVal)),
              {instrument: testVal})
  t.end()
})

test(`${reducerName} controlPadPortamentoSet`, t => {
  t.deepEqual(reducer({portamento: false}, controlPadPortamentoSet(true)),
              {portamento: true})
  t.end()
})

test(`${reducerName} controlPadOctaveSet`, t => {
  t.deepEqual(reducer({octave: -1}, controlPadOctaveSet(3)),
              {octave: 3})
  t.end()
})

test(`${reducerName} updateControlNoScale`, t => {
  t.deepEqual(reducer({noScale: true}, controlPadNoScaleSet(false)),
              {noScale: false})
  t.end()
})

test(`${reducerName} controlPadRangeSet`, t => {
  t.deepEqual(reducer({range: 1}, controlPadRangeSet(2)),
              {range: 2})
  t.end()
})
