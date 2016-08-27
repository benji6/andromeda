import test from 'tape'
import reducer from './nav'
import {navLastDirectionSet} from '../actions'

const reducerName = 'nav reducer'

test(`${reducerName} returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), {lastDirection: 'right'})
  t.end()
})

test(`${reducerName} reducer navLastDirectionSet`, t => {
  t.deepEqual(
    reducer({lastDirection: 'right'}, navLastDirectionSet('left')),
    {lastDirection: 'left'}
  )
  t.end()
})
