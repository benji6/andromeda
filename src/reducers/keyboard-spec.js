import test from 'tape'
import reducer, {initialState} from './keyboard'
import {
  keyboardMonophonicSet,
  keyboardInstrumentSet,
  keyboardOctaveSet,
  keyboardVolumeSet,
} from '../actions'

const reducerName = 'keyboard reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} keyboardMonophonicSet`, t => {
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

test(`${reducerName} keyboardInstrumentSet`, t => {
  t.deepEqual(reducer(undefined, keyboardInstrumentSet('piano')),
              {...initialState, instrument: 'piano'})
  t.deepEqual(reducer(undefined, keyboardInstrumentSet('tuba')),
              {...initialState, instrument: 'tuba'})
  t.end()
})

test(`${reducerName} keyboardOctaveSet`, t => {
  t.deepEqual(reducer(undefined, keyboardOctaveSet(1)),
              {...initialState, octave: 1})
  t.deepEqual(reducer(undefined, keyboardOctaveSet(-1)),
              {...initialState, octave: -1})
  t.end()
})

test(`${reducerName} keyboardVolumeSet`, t => {
  t.deepEqual(reducer(undefined, keyboardVolumeSet(0.5)),
              {...initialState, volume: 0.5})
  t.deepEqual(reducer(undefined, keyboardVolumeSet(0.6)),
              {...initialState, volume: 0.6})
  t.end()
})
