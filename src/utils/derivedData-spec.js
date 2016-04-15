import test from 'tape'
import {
  arpeggiatedScale,
  currentScale,
  instrumentInstance
} from './derivedData'
import {cycle, take} from './lazyIterables'

test('derivedData - currentScale', t => {
  t.deepEqual(currentScale({
    scaleName: 'pentatonic'
  }), [0, 3, 5, 7, 10])
  t.end()
})

test('derivedData - arpeggiatedScale', t => {
  t.deepEqual(
    [...take(16, arpeggiatedScale({
      arpeggiatorPatterns: {
        up: cycle
      },
      scale: {
        scaleName: 'ionian (major)',
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
        up: cycle
      },
      scale: {
        scaleName: 'ionian (major)',
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

test('derivedData - instrumentInstance', t => {
  const instance = {}
  t.deepEqual(instrumentInstance('test instrument instance name', {
    instrumentInstances: [{name: 'test instrument instance name', instance}]
  }), instance)
  t.end()
})
