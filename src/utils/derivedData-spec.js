import test from 'tape'
import {
  controllableInstrumentInstanceNames,
  effectInstance,
  instrumentInstance,
} from './derivedData'
import {noop} from './helpers'

test('derivedData - controllableInstrumentInstanceNames', t => {
  t.deepEqual(controllableInstrumentInstanceNames({
    instrumentInstances: [
      {instance: {noteStart () {}}, name: 'name 1'},
      {instance: {noteStart: noop}, name: 'name 2'},
    ],
  }), ['name 1'])
  t.end()
})

test('derivedData - effectInstance', t => {
  const instance = {}
  t.deepEqual(effectInstance('test instance name', {
    effectInstances: [{instance, name: 'test instance name'}],
  }), instance)
  t.end()
})

test('derivedData - instrumentInstance', t => {
  const instance = {}
  t.deepEqual(instrumentInstance('test instrument instance name', {
    instrumentInstances: [{instance, name: 'test instrument instance name'}],
  }), instance)
  t.end()
})
