import {
  add,
  compose,
  curry,
  flatten,
  flip,
  map,
  multiply,
  nth,
  range
} from 'ramda'
import store from '../../store'
import {lazyMapIndexed} from '../../helpers'
import audioContext from '../../audioContext'
import nextNoteStartTime from '../../audioHelpers/nextNoteStartTime'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import {currentScale} from '../../derivedData'

export const createLoopAudioGraphFragment = curry((
  {instrument, octave, rootNote},
  {id, pitch, modulation}
) => {
  const {
    arpeggiatorPatterns,
    bpm,
    scale,
    controlPad: {arpeggiatorOctaves, selectedArpeggiatorPattern}
  } = store.getState()
  const arpeggiatedScale = flatten(map(
    x => map(compose(add(x), flip(nth)(currentScale(scale))), [0, 2, 4]),
    map(multiply(12), range(0, arpeggiatorOctaves))
  ))
  const noteDuration = 60 / bpm / 4
  const {currentTime} = audioContext
  return lazyMapIndexed((x, i) => {
    const startTime = nextNoteStartTime(noteDuration, currentTime) +
      i * noteDuration
    const frequency = pitchToFrequency(pitch + x + 12 * octave + rootNote)
    const gain = (1 - modulation) / 2
    return {
      id: `${id}-${i}-${frequency}-${gain}`,
      instrument,
      params: {
        gain,
        frequency,
        startTime,
        stopTime: startTime + noteDuration
      }
    }
  },
  (arpeggiatorPatterns[selectedArpeggiatorPattern](arpeggiatedScale)))
})
