import test from 'tape'
import reducer from './instruments'
import {addInstrument} from '../actions'

const reducerName = 'instrument'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {})
  t.deepEqual(reducer(undefined, {}), {})
  t.end()
})

test(`${reducerName} - addInstrument`, t => {
  const testInstrument = {prop: 'some prop', someMethod () {}}
  t.deepEqual(
    reducer({}, addInstrument(testInstrument, 'test instrument')),
    {'test instrument': testInstrument}
  )
  t.end()
})
