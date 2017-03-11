import test from 'tape'
import {newId} from './helpers'

test('helpers - newId', t => {
  t.equal(newId([
    {id: 45},
    {id: 30},
    {id: 1},
    {id: 0},
  ]), 2)
  t.end()
})
