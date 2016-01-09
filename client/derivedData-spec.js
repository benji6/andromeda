import test from 'tape'
import {arpeggiatedScale, currentScale} from './derivedData'
import {makeCircular, take} from 'imlazy'

test('derivedData - currentScale', t => {
  t.deepEqual(currentScale({
    scales: {a: [0, 2, 4]},
    scaleName: 'a'
  }), [0, 2, 4])
  t.end()
})

test('derivedData - arpeggiatedScale', t => {
  t.deepEqual(
    [...take(16, arpeggiatedScale({
      arpeggiatorPatterns: {
        'up': makeCircular
      },
      scale: {
        scaleName: 'major',
        scales: {
          major: [0, 2, 4, 5, 7, 9, 11]
        }
      },
      controlPad: {
        arpeggiatorOctaves: 2,
        selectedArpeggiatorPattern: 'up'
      }
    }))],
    [0, 4, 7, 12, 16, 19, 0, 4, 7, 12, 16, 19, 0, 4, 7, 12]
  )
  t.deepEqual(
    [...take(16, arpeggiatedScale({
      arpeggiatorPatterns: {
        'up': makeCircular
      },
      scale: {
        scaleName: 'major',
        scales: {
          major: [0, 2, 4, 5, 7, 9, 11]
        }
      },
      controlPad: {
        arpeggiatorOctaves: 1,
        selectedArpeggiatorPattern: 'up'
      }
    }))],
    [0, 4, 7, 0, 4, 7, 0, 4, 7, 0, 4, 7, 0, 4, 7, 0]
  )
  t.end()
})
