import test from 'tape'
import {clamp, decimalPart} from './helpers'

test('helpers - clamp', t => {
  const clampZeroOne = clamp(0, 1)
  t.equal(clampZeroOne(-1), 0)
  t.equal(clampZeroOne(0), 0)
  t.equal(clampZeroOne(0.5), 0.5)
  t.equal(clampZeroOne(1), 1)
  t.equal(clampZeroOne(1.5), 1)
  t.equal(clampZeroOne(1000), 1)
  t.end()
})

test('helpers - decimalPart', t => {
  t.equal(decimalPart(1.00012), 0.00012)
  t.equal(decimalPart(1239023.00012), 0.00012)
  t.equal(decimalPart(1), 0)
  t.end()
})
