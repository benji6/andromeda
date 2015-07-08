/* */ 
"format cjs";
import { assert } from 'chai'
import sinon from 'sinon'
import transmitter from '../'

export default {
  'functions exist'() {
    const bus = transmitter()
    assert.isFunction(bus.subscribe)
    assert.isFunction(bus.push)
    assert.isFunction(bus.unsubscribe)
  },

  'can listen and dispose'() {
    const bus = transmitter()
    const result = bus.subscribe(function () { })
    assert.isObject(result)
    assert.isFunction(result.dispose)
    const undef = result.dispose()
    assert.isUndefined(undef)
  },

  'pushing'() {
    const bus = transmitter()
    const spy = sinon.spy()

    const subscription = bus.subscribe(spy)

    bus.push('hello')

    assert.ok(spy.calledOnce)
    assert(spy.firstCall.args[0] === 'hello')

    subscription.dispose()
  },

  'unsub shortcut'() {
    const bus = transmitter()
    const spy = sinon.spy()
    bus.subscribe(spy)
    bus.unsubscribe(spy)

    bus.push(1)

    assert.notOk(spy.calledOnce)
    assert(spy.callCount === 0)
  },

  'unlisten dont exist'() {
    const bus = transmitter()
    bus.unsubscribe(function () { })
  }
}
