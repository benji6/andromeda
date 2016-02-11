import test from 'tape'
import reducer from './plugins'
import {
  addInstrumentToChannel,
  instantiateEffect,
  instantiateInstrument,
  loadPluginEffect,
  loadPluginInstrument
} from '../actions'

const reducerName = 'plugins'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {
    effectInstances: [],
    effectPlugins: [],
    instrumentInstances: [],
    instrumentPlugins: []
  })
  t.end()
})

test(`${reducerName} reducer - addInstrumentToChannel`, t => {
  const constructor = class {connect () {} disconnect () {}}
  const instance = new constructor()
  t.deepEqual(
    reducer({
      effectInstances: [{channel: 0, instance, name: 'test effect plugin'}],
      effectPlugins: [],
      instrumentInstances: [{name: 'fake instance name', instance}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }, addInstrumentToChannel({channel: 0, name: 'fake instance name'})),
    {
      effectInstances: [{channel: 0, instance, name: 'test effect plugin'}],
      effectPlugins: [],
      instrumentInstances: [{channel: 0, name: 'fake instance name', instance}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }
  )
  t.end()
})

test(`${reducerName} reducer - instantiateEffect`, t => {
  const constructor = class {connect () {}}
  t.deepEqual(
    reducer({
      effectInstances: [],
      effectPlugins: [{constructor, name: 'test effect plugin'}],
      instrumentInstances: [],
      instrumentPlugins: []
    }, instantiateEffect({channel: 0, name: 'fake effect name', plugin: 'test effect plugin'})),
    {
      effectInstances: [{
        channel: 0,
        instance: new constructor(),
        name: 'fake effect name'
      }],
      effectPlugins: [{constructor, name: 'test effect plugin'}],
      instrumentInstances: [],
      instrumentPlugins: []
    }
  )
  t.end()
})

test(`${reducerName} reducer - instantiateInstrument`, t => {
  const constructor = class {connect () {}}
  t.deepEqual(
    reducer({
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }, instantiateInstrument({name: 'fake instance name', plugin: 'test instrument plugin'})),
    {
      effectInstances: [],
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
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: []
    }, loadPluginEffect('test effect')),
    {
      effectInstances: [],
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
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: []
    }, loadPluginInstrument('test instrument')),
    {
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: ['test instrument']
    }
  )
  t.end()
})
