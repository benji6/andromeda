import test from 'tape'
import reducer from './plugins'
import {
  instantiateInstrument,
  loadPluginEffect,
  loadPluginInstrument
} from '../actions'

const reducerName = 'plugins'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {
    channels: [],
    effectPlugins: [],
    instrumentInstances: [],
    instrumentPlugins: []
  })
  t.end()
})

test(`${reducerName} reducer - instantiateInstrument`, t => {
  const constructor = class {connect () {}}
  t.deepEqual(
    reducer({
      channels: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }, instantiateInstrument({name: 'fake instance name', plugin: 'test instrument plugin'})),
    {
      channels: [],
      effectPlugins: [],
      instrumentInstances: [{name: 'fake instance name', instance: new constructor()}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }
  )
  t.end()
})

test(`${reducerName} reducer - loadPluginEffect`, t => {
  t.true(
    reducer({
      channels: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: []
    }, loadPluginEffect('test effect')),
    {
      channels: [],
      effectPlugins: ['test effect'],
      instrumentInstances: [],
      instrumentPlugins: []
    }
  )
  t.end()
})

test(`${reducerName} reducer - loadPluginInstrument`, t => {
  t.deepEqual(
    reducer({
      channels: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: []
    }, loadPluginInstrument('test instrument')),
    {
      channels: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: ['test instrument']
    }
  )
  t.end()
})
