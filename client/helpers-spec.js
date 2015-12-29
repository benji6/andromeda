import test from 'tape'
import {decimalPart} from './helpers'

test('helpers - decimalPart', t => {
  t.equal(decimalPart(1.00012), 0.00012)
  t.equal(decimalPart(1239023.00012), 0.00012)
  t.equal(decimalPart(1), 0)
  t.end()
})
