import test from 'tape'
import {computeId, getNewestId} from './_tools'

test(`reducer tools: computeId`, t => {
  t.equal(computeId([]), 0)
  t.equal(computeId([{id: 1}]), 2)
  t.equal(computeId([{id: 42}, {id: 12}]), 43)
  t.end()
})

test(`reducer tools: getNewestId`, t => {
  t.equal(getNewestId([{id: 1}]), 1)
  t.equal(getNewestId([{id: 42}, {id: 12}]), 42)
  t.end()
})
