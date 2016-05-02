import {dissoc} from 'ramda'
import test from 'tape'
import reducer from './plugins'
import {
  addChannel,
  addEffectToChannel,
  addInstrumentToChannel,
  instantiateEffect,
  instantiateInstrument,
  loadPluginEffect,
  loadPluginInstrument,
  removeChannel,
  removeEffectFromChannel,
  removeInstrumentFromChannel
} from '../actions'

const reducerName = 'plugins'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {
    channels: [{name: 0, effects: [], instruments: []}],
    effectInstances: [],
    effectPlugins: [],
    instrumentInstances: [],
    instrumentPlugins: []
  })
  t.end()
})

test(`${reducerName} reducer - addChanel`, t => {
  t.deepEqual(
    reducer({
      channels: [{name: 1, effects: [], instruments: []}],
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: []
    }, addChannel()),
    {
      channels: [
        {name: 0, effects: [], instruments: []},
        {name: 1, effects: [], instruments: []}
      ],
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: []
    }
  )
  t.end()
})

test(`${reducerName} reducer - addEffectToChannel`, t => {
  const constructor = class {connect () {} disconnect () {}}
  const instance = new constructor()
  t.deepEqual(
    reducer({
      channels: [{name: 0, effects: [], instruments: []}],
      effectInstances: [{instance, name: 'test effect'}],
      effectPlugins: [{constructor, name: 'test effect plugin'}],
      instrumentInstances: [],
      instrumentPlugins: []
    }, addEffectToChannel({channel: 0, name: 'test effect'})),
    {
      channels: [{name: 0, effects: ['test effect'], instruments: []}],
      effectInstances: [{instance, name: 'test effect'}],
      effectPlugins: [{constructor, name: 'test effect plugin'}],
      instrumentInstances: [],
      instrumentPlugins: []
    }
  )
  t.end()
})

test(`${reducerName} reducer - addInstrumentToChannel`, t => {
  const constructor = class {connect () {} disconnect () {}}
  const instance = new constructor()
  t.deepEqual(
    reducer({
      channels: [{name: 0, effects: ['test effect plugin'], instruments: []}],
      effectInstances: [{instance, name: 'test effect plugin'}],
      effectPlugins: [],
      instrumentInstances: [{name: 'fake instance name', instance}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }, addInstrumentToChannel({channel: 0, name: 'fake instance name'})),
    {
      channels: [{
        name: 0,
        effects: ['test effect plugin'],
        instruments: ['fake instance name']
      }],
      effectInstances: [{instance, name: 'test effect plugin'}],
      effectPlugins: [],
      instrumentInstances: [{name: 'fake instance name', instance}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }
  )
  t.end()
})

test(`${reducerName} reducer - instantiateEffect`, t => {
  const constructor = class {connect () {}}
  t.deepEqual(
    reducer({
      channels: [{name: 0, effects: [], instruments: []}],
      effectInstances: [],
      effectPlugins: [{constructor, name: 'test effect plugin'}],
      instrumentInstances: [],
      instrumentPlugins: []
    }, instantiateEffect({
      name: 'fake effect name',
      plugin: 'test effect plugin'
    })),
    {
      channels: [{name: 0, effects: [], instruments: []}],
      effectInstances: [{instance: new constructor(), name: 'fake effect name'}],
      effectPlugins: [{constructor, name: 'test effect plugin'}],
      instrumentInstances: [],
      instrumentPlugins: []
    }
  )
  t.end()
})

test(`${reducerName} reducer - instantiateInstrument`, t => {
  const constructor = () => ({
    connect () {},
    disconnect () {},
    render () {},
  })
  t.deepEqual(
    dissoc('instrumentInstances', reducer({
      channels: [],
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }, instantiateInstrument({name: 'fake instance name', plugin: 'test instrument plugin'}))),
    {
      channels: [],
      effectInstances: [],
      effectPlugins: [],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }
  )
  t.end()
})

test(`${reducerName} reducer - loadPluginEffect`, t => {
  t.true(
    reducer({
      channels: [],
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: []
    }, loadPluginEffect('test effect')),
    {
      channels: [],
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
      channels: [],
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: []
    }, loadPluginInstrument('test instrument')),
    {
      channels: [],
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: ['test instrument']
    }
  )
  t.end()
})

test(`${reducerName} reducer - removeChannel`, t => {
  t.deepEqual(
    reducer({
      channels: [
        {name: 0, effects: [], instruments: []},
        {name: 1, effects: [], instruments: []}
      ],
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: []
    }, removeChannel(0)),
    {
      channels: [{name: 1, effects: [], instruments: []}],
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: []
    }
  )
  t.end()
})

test(`${reducerName} reducer - removeEffectFromChannel`, t => {
  const constructor = class {connect () {} disconnect () {}}
  const instance = new constructor()
  t.deepEqual(
    reducer({
      channels: [{
        effects: ['fake instance name'],
        instruments: [],
        name: 0
      }],
      effectInstances: [{instance, name: 'fake instance name'}],
      effectPlugins: [{constructor, name: 'test plugin'}],
      instrumentInstances: [],
      instrumentPlugins: []
    }, removeEffectFromChannel({channel: 0, name: 'fake instance name'})),
    {
      channels: [{name: 0, effects: [], instruments: []}],
      effectInstances: [{instance, name: 'fake instance name'}],
      effectPlugins: [{constructor, name: 'test plugin'}],
      instrumentInstances: [],
      instrumentPlugins: []
    }
  )
  t.end()
})

test(`${reducerName} reducer - removeInstrumentFromChannel`, t => {
  const constructor = class {connect () {} disconnect () {}}
  const instance = new constructor()
  t.deepEqual(
    reducer({
      channels: [{
        name: 0,
        effects: ['test effect plugin'],
        instruments: ['fake instance name']
      }],
      effectInstances: [{instance, name: 'test effect plugin'}],
      effectPlugins: [],
      instrumentInstances: [{name: 'fake instance name', instance}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }, removeInstrumentFromChannel({channel: 0, name: 'fake instance name'})),
    {
      channels: [{name: 0, effects: ['test effect plugin'], instruments: []}],
      effectInstances: [{instance, name: 'test effect plugin'}],
      effectPlugins: [],
      instrumentInstances: [{name: 'fake instance name', instance}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}]
    }
  )
  t.end()
})
