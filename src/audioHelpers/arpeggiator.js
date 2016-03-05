import {cycle, lazyMap, range, zipWith} from '../utils/lazyIterables'
import Looper from './Looper'
import store from '../store'
import audioContext from '../audioContext'
import {arpeggiatedScale} from '../utils/derivedData'
import nextNoteStartTime from './nextNoteStartTime'
import pitchToFrequency from './pitchToFrequency'
import {instrumentInstance} from '../utils/derivedData'

const onStop = x => {
  const {controlPad: {instrument}, plugins} = store.getState()
  instrumentInstance(instrument, plugins).inputNoteStop(x)
}

const gain = modulation => (1 - modulation) / 2

let looper = null

export const startArpeggiator = ({id, pitch, modulation}) => {
  const {
    bpm,
    controlPad: {instrument, octave},
    plugins,
    rootNote
  } = store.getState()

  const onStart = x => {
    instrumentInstance(instrument, plugins).inputNoteStart({
      ...x,
      frequency: pitchToFrequency(pitch + x.pitch + 12 * octave + rootNote),
      gain: gain(modulation)
    })
  }

  if (looper) {
    looper.onStart = onStart
    return
  }
  const currentArpeggiatedScale = arpeggiatedScale(store.getState())
  const {currentTime} = audioContext
  const noteDuration = 60 / bpm / 4
  const startAndStopTimes = lazyMap(
    i => {
      const startTime = nextNoteStartTime(noteDuration, currentTime) +
        i * noteDuration
      return {
        i,
        startTime,
        stopTime: startTime + noteDuration
      }
    },
    range(0, Infinity)
  )
  const pitchStartStops = zipWith(
    (startAndStopTime, pitch) => ({...startAndStopTime, pitch}),
    startAndStopTimes,
    currentArpeggiatedScale
  )

  const iterable = zipWith(
    (x, i) => ({
      ...x,
      id: `${id}-${pitch}-${i}`,
      instrument,
      pitch: x.pitch
    }),
    pitchStartStops,
    cycle(range(0, 8))
  )
  looper = new Looper({iterable, onStart, onStop})
  looper.start()
}

export const stopArpeggiator = _ => {
  looper && looper.stop()
  looper = null
}
