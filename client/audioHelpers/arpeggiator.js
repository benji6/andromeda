import {cycle, map, range, zipWith} from 'imlazy'
import {compose, prop} from 'ramda'
import Looper from './Looper'
import store, {dispatch} from '../store'
import audioContext from '../audioContext'
import {
  addAudioGraphSource,
  removeKeysFromAudioGraphContaining
} from '../actions'
import {arpeggiatedScale} from '../derivedData'
import nextNoteStartTime from './nextNoteStartTime'
import pitchToFrequency from './pitchToFrequency'

const dispatchRemoveKeysFromAGContaining = compose(
  dispatch,
  removeKeysFromAudioGraphContaining
)
const onStop = x => compose(dispatchRemoveKeysFromAGContaining, prop('id'))(x)

let looper = null

export const startArpeggiator = ({id, pitch, modulation}) => {
  if (looper) return
  const currentArpeggiatedScale = arpeggiatedScale(store.getState())
  const {bpm, controlPad: {instrument, octave}, rootNote} = store.getState()
  const {currentTime} = audioContext
  const noteDuration = 60 / bpm / 4
  const startAndStopTimes = map(
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
  const gain = (1 - modulation) / 2
  const iterable = zipWith(
    (x, i) => {
      const frequency = pitchToFrequency(pitch + x.pitch + 12 * octave +
        rootNote)
      return {
        ...x,
        id: `${id}-${frequency}-${i}`,
        instrument,
        params: {frequency, gain},
        pitch: x.pitch
      }
    },
    pitchStartStops,
    cycle(range(0, 8))
  )
  const onStart = compose(
    dispatch,
    addAudioGraphSource,
    x => ({...x, params: {...x.params, gain}})
  )
  looper = new Looper({iterable, onStart, onStop})
  looper.start()
}
export const stopArpeggiator = _ => {
  looper && looper.stop()
  looper = null
}
