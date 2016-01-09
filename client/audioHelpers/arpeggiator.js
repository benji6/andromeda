import {map, range, zipWith} from 'imlazy'
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

const onStop = compose(dispatch, removeKeysFromAudioGraphContaining, prop('id'))
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
  const iterable = map(
    x => {
      const frequency = pitchToFrequency(pitch + x.pitch + 12 * octave +
        rootNote)
      return {
        ...x,
        id: `${id}-${frequency}`,
        instrument,
        params: {frequency, gain},
        pitch: x.pitch
      }
    },
    pitchStartStops
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
