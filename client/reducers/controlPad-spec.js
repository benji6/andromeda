import test from 'tape'
import reducer, {initialState} from './controlPad'
import {
  updateControlPadArpeggiatorIsOn,
  updateControlPadArpeggiatorOctaves,
  updateControlPadInstrument,
  updateControlPadNoScale,
  updateControlPadOctave,
  updateControlPadPortamento,
  updateControlPadRange,
  updateControlPadSelectedArpeggiatorPattern
} from '../actions'

const reducerName = 'controlPad'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})

test(`${reducerName} reducer updateControlPadArpeggiatorIsOn`, t => {
  t.deepEqual(reducer(undefined, updateControlPadArpeggiatorIsOn(true)),
              {...initialState, arpeggiatorIsOn: true})
  t.deepEqual(reducer(undefined, updateControlPadArpeggiatorIsOn(false)),
              {...initialState, arpeggiatorIsOn: false})
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

test(`${reducerName} reducer updateControlPadSelectedArpeggiatorPattern`, t => {
  t.deepEqual(reducer(undefined, updateControlPadSelectedArpeggiatorPattern('test pattern')),
              {...initialState, selectedArpeggiatorPattern: 'test pattern'})
  t.end()
})

test(`${reducerName} reducer updateControlPadArpeggiatorOctaves`, t => {
  t.deepEqual(reducer(undefined, updateControlPadArpeggiatorOctaves(1)),
              {...initialState, arpeggiatorOctaves: 1})
  t.deepEqual(reducer(undefined, updateControlPadArpeggiatorOctaves(2)),
              {...initialState, arpeggiatorOctaves: 2})
  t.end()
})
