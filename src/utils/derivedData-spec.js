import test from 'tape'
import {instrumentInstance} from './derivedData'

test('derivedData - instrumentInstance', t => {
  const instance = {}
  t.deepEqual(instrumentInstance('test instrument instance name', {
    instrumentInstances: [{name: 'test instrument instance name', instance}]
  }), instance)
  t.end()
})
