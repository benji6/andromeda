import {dissoc} from 'ramda'
import test from 'tape'
import reducer from './plugins'
import {
  addEffectToChannel,
  addInstrumentToChannel,
  instantiateEffect,
  instantiateInstrument,
  loadPluginEffect,
  loadPluginInstrument,
  removeEffectFromChannel,
  removeInstrumentFromChannel,
} from '../actions'

const reducerName = 'plugins'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {
    channels: [{effects: [], instruments: [], name: 0}],
    effectInstances: [],
    effectPlugins: [],
    instrumentInstances: [],
    instrumentPlugins: [],
  })
  t.end()
})

test(`${reducerName} reducer - addEffectToChannel`, t => {
  const constructor = class {connect () {} disconnect () {}}
  const instance = new constructor()
  t.deepEqual(
    reducer({
      channels: [{effects: [], instruments: [], name: 0}],
      effectInstances: [{instance, name: 'test effect'}],
      effectPlugins: [{constructor, name: 'test effect plugin'}],
      instrumentInstances: [],
      instrumentPlugins: [],
    }, addEffectToChannel({channel: 0, name: 'test effect'})),
    {
      channels: [{effects: ['test effect'], instruments: [], name: 0}],
      effectInstances: [{instance, name: 'test effect'}],
      effectPlugins: [{constructor, name: 'test effect plugin'}],
      instrumentInstances: [],
      instrumentPlugins: [],
    }
  )
  t.end()
})

test(`${reducerName} reducer - addInstrumentToChannel`, t => {
  const constructor = class {connect () {} disconnect () {}}
  const instance = new constructor()
  t.deepEqual(
    reducer({
      channels: [{effects: ['test effect plugin'], instruments: [], name: 0}],
      effectInstances: [{instance, name: 'test effect plugin'}],
      effectPlugins: [],
      instrumentInstances: [{instance, name: 'fake instance name'}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}],
    }, addInstrumentToChannel({channel: 0, name: 'fake instance name'})),
    {
      channels: [{
        effects: ['test effect plugin'],
        instruments: ['fake instance name'],
        name: 0,
      }],
      effectInstances: [{instance, name: 'test effect plugin'}],
      effectPlugins: [],
      instrumentInstances: [{instance, name: 'fake instance name'}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}],
    }
  )
  t.end()
})

test(`${reducerName} reducer - instantiateEffect`, t => {
  const constructor = class {
    connect () {}
    disconnect () {}
    render () {}
  }
  t.deepEqual(
    dissoc('effectInstances', reducer({
      channels: [{effects: [], instruments: [], name: 0}],
      effectInstances: [],
      effectPlugins: [{constructor, name: 'test effect plugin'}],
      instrumentInstances: [],
      instrumentPlugins: [],
    }, instantiateEffect({
      name: 'fake effect name',
      plugin: 'test effect plugin',
    }))),
    {
      channels: [{effects: [], instruments: [], name: 0}],
      effectPlugins: [{constructor, name: 'test effect plugin'}],
      instrumentInstances: [],
      instrumentPlugins: [],
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
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}],
    }, instantiateInstrument({name: 'fake instance name', plugin: 'test instrument plugin'}))),
    {
      channels: [],
      effectInstances: [],
      effectPlugins: [],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}],
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
      instrumentPlugins: [],
    }, loadPluginEffect('test effect')),
    {
      channels: [],
      effectInstances: [],
      effectPlugins: ['test effect'],
      instrumentInstances: [],
      instrumentPlugins: [],
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
      instrumentPlugins: [],
    }, loadPluginInstrument('test instrument')),
    {
      channels: [],
      effectInstances: [],
      effectPlugins: [],
      instrumentInstances: [],
      instrumentPlugins: ['test instrument'],
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
        name: 0,
      }],
      effectInstances: [{instance, name: 'fake instance name'}],
      effectPlugins: [{constructor, name: 'test plugin'}],
      instrumentInstances: [],
      instrumentPlugins: [],
    }, removeEffectFromChannel({channel: 0, name: 'fake instance name'})),
    {
      channels: [{effects: [], instruments: [], name: 0}],
      effectInstances: [{instance, name: 'fake instance name'}],
      effectPlugins: [{constructor, name: 'test plugin'}],
      instrumentInstances: [],
      instrumentPlugins: [],
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
        effects: ['test effect plugin'],
        instruments: ['fake instance name'],
        name: 0,
      }],
      effectInstances: [{instance, name: 'test effect plugin'}],
      effectPlugins: [],
      instrumentInstances: [{instance, name: 'fake instance name'}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}],
    }, removeInstrumentFromChannel({channel: 0, name: 'fake instance name'})),
    {
      channels: [{effects: ['test effect plugin'], instruments: [], name: 0}],
      effectInstances: [{instance, name: 'test effect plugin'}],
      effectPlugins: [],
      instrumentInstances: [{instance, name: 'fake instance name'}],
      instrumentPlugins: [{constructor, name: 'test instrument plugin'}],
    }
  )
  t.end()
})
