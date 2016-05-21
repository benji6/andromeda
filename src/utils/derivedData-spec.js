import test from 'tape'
import {
  controllableInstrumentInstanceNames,
  effectInstance,
  instrumentInstance,
} from './derivedData'

test('derivedData - controllableInstrumentInstanceNames', t => {
  t.deepEqual(controllableInstrumentInstanceNames({
    instrumentInstances: [
      {name: 'name 1', instance: {noteStart () {}}},
      {name: 'name 2', instance: {}},
    ]
  }), ['name 1'])
  t.end()
})

test('derivedData - effectInstance', t => {
  const instance = {}
  t.deepEqual(effectInstance('test instance name', {
    effectInstances: [{name: 'test instance name', instance}]
  }), instance)
  t.end()
})

test('derivedData - instrumentInstance', t => {
  const instance = {}
  t.deepEqual(instrumentInstance('test instrument instance name', {
    instrumentInstances: [{name: 'test instrument instance name', instance}]
  }), instance)
  t.end()
})
