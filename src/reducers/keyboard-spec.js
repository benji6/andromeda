import test from 'tape'
import reducer, {initialState} from './keyboard'
import {
  keyboardMonophonicSet,
  keyboardInstrumentSet,
  keyboardOctaveSet,
  keyboardVolumeSet,
} from '../actions'

const reducerName = 'keyboard'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} reducer keyboardMonophonicSet`, t => {
  t.deepEqual(
    reducer({monophonic: false}, keyboardMonophonicSet(true)),
    {monophonic: true}
  )
  t.deepEqual(
    reducer({monophonic: true}, keyboardMonophonicSet(false)),
    {monophonic: false}
  )
  t.end()
})

test(`${reducerName} reducer keyboardInstrumentSet`, t => {
  t.deepEqual(reducer(undefined, keyboardInstrumentSet('piano')),
              {...initialState, instrument: 'piano'})
  t.deepEqual(reducer(undefined, keyboardInstrumentSet('tuba')),
              {...initialState, instrument: 'tuba'})
  t.end()
})

test(`${reducerName} reducer keyboardOctaveSet`, t => {
  t.deepEqual(reducer(undefined, keyboardOctaveSet(1)),
              {...initialState, octave: 1})
  t.deepEqual(reducer(undefined, keyboardOctaveSet(-1)),
              {...initialState, octave: -1})
  t.end()
})

test(`${reducerName} reducer keyboardVolumeSet`, t => {
  t.deepEqual(reducer(undefined, keyboardVolumeSet(0.5)),
              {...initialState, volume: 0.5})
  t.deepEqual(reducer(undefined, keyboardVolumeSet(0.6)),
              {...initialState, volume: 0.6})
  t.end()
})
