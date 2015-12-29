import test from 'tape'
import nextNoteStartTime from './nextNoteStartTime'

test('audioHelpers - nextNoteStartTime', t => {
  t.equal(nextNoteStartTime(0.5, 1 - Number.EPSILON), 1)
  t.equal(nextNoteStartTime(0.5, 1), 1.5)
  t.equal(nextNoteStartTime(0.1, 101.01), 101.10000000000001)
  t.end()
})
