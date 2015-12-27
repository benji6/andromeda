import {
  append,
  compose,
  equals,
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

const timeoutPeriod = (source, currentTime) =>
  (source.params.startTime - audioContext.currentTime) * 1000 - 50

let activeNotes = []
let timeoutId = null

export const startLoop = audioGraphFragments => {
  if (timeoutId !== null) clearTimeout(timeoutId)
  const generator = audioGraphFragments[Symbol.iterator]()
  const firstSource = generator.next().value
  const secondSource = generator.next().value
  activeNotes = reject(
    x => paramsStopTimePath(x) < audioContext.currentTime,
    activeNotes
  )
  if (none(
    compose(equals(paramsStartTimePath(firstSource)), paramsStartTimePath),
    activeNotes
  )) {
    dispatchAddAudioGraphSource({...firstSource, id: firstSource.id + Math.random()})
    activeNotes = append(firstSource, activeNotes)
  }
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
    activeNotes = append(nextSource, activeNotes)
    dispatchAddAudioGraphSource(currentSource)
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
  timeoutId = null
  forEach(
    ({id}) => dispatch(removeKeysFromAudioGraphContaining(id)),
    activeNotes
  )
  activeNotes = []
}
