import test from 'tape'
import {makeClassName} from './helpers'

test('helpers - makeClassName', t => {
  t.equal(makeClassName('a', 'b', 'c'), 'a b c')
  t.equal(makeClassName('a', false && 'b', 'c'), 'a c')
  t.end()
})
