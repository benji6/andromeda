import test from 'tape'
import {currentScale} from './derivedData'

test('derivedData - currentScale', t => {
  t.deepEqual(currentScale({
    scales: {a: [0, 2, 4]},
    scaleName: 'a'
  }), [0, 2, 4])
  t.end()
})
