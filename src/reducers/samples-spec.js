import test from 'tape'
import reducer from './samples'
import {sampleFetched} from '../actions'

const reducerName = 'samples reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {})
  t.end()
})

test(`${reducerName} sampleFetched`, t => {
  t.deepEqual(
    reducer({somekey: [1, 1, 2]}, sampleFetched(['test name', [3, 5, 8]])),
    {
      somekey: [1, 1, 2],
      'test name': [3, 5, 8],
    })
  t.end()
})
