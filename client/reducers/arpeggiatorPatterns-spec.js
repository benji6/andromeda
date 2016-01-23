import test from 'tape'
import reducer, {initialState} from './arpeggiatorPatterns'

const reducerName = 'arpeggiatorPatterns'

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState)
  t.deepEqual(reducer(undefined, {}), initialState)
  t.end()
})
