import test from 'tape'
import {
  arpeggiatedScale,
  instrumentInstance
} from './derivedData'
import {cycle, take} from './lazyIterables'

test('derivedData - arpeggiatedScale', t => {
  t.deepEqual(
    [...take(16, arpeggiatedScale({
      arpeggiatorPatterns: {
        up: cycle
      },
      settings: {
        selectedScale: 'ionian (major)',
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
      settings: {
        selectedScale: 'ionian (major)',
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
