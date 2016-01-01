import {
  append,
  compose,
  curry,
  forEach,
  none,
  partition,
  reject
} from 'ramda'
import {dispatch} from '../store'
import audioContext from '../audioContext'
import {
  addAudioGraphSource,
  removeKeysFromAudioGraphContaining
} from '../actions'
import {paramsStartTimePath, paramsStopTimePath} from '../helpers'

const dispatchAddAudioGraphSource = compose(dispatch, addAudioGraphSource)
const veryClose = curry((a, b) => a > b - 0.000000001 && a < b + 0.000000001)
const timeoutPeriod = (source, currentTime) =>
  (source.params.startTime - audioContext.currentTime) * 1000 - 50

let activeNotes = []
let timeoutId = null

const dispatchAddAndUpdateActiveNotes = src => {
  dispatchAddAudioGraphSource(src)
  activeNotes = append(src, activeNotes)
}

export const startLoop = audioGraphFragments => {
  clearTimeout(timeoutId)
  const generator = audioGraphFragments[Symbol.iterator]()
  const firstSource = generator.next().value
  const secondSource = generator.next().value
  activeNotes = reject(
    x => paramsStopTimePath(x) < audioContext.currentTime,
    activeNotes
  )
  if (none(
    compose(veryClose(paramsStartTimePath(firstSource)), paramsStartTimePath),
    activeNotes
  )) dispatchAddAndUpdateActiveNotes(firstSource)
  const recur = (currentSource, nextSource) => _ => {
    const partitioned = partition(
      x => paramsStopTimePath(x) < audioContext.currentTime,
      activeNotes
    )
    activeNotes = partitioned[1]
    forEach(
      ({id}) => dispatch(removeKeysFromAudioGraphContaining(id)),
      partitioned[0]
    )
    dispatchAddAndUpdateActiveNotes(currentSource)
    timeoutId = setTimeout(
      recur(nextSource, generator.next().value),
      timeoutPeriod(nextSource, audioContext.currentTime)
    )
  }
  timeoutId = setTimeout(
    recur(secondSource, generator.next().value),
    timeoutPeriod(secondSource, audioContext.currentTime)
  )
}

export const stopLoop = _ => {
  clearTimeout(timeoutId)
  forEach(
    ({id}) => dispatch(removeKeysFromAudioGraphContaining(id)),
    activeNotes
  )
  activeNotes = []
}
