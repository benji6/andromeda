import {append, compose, forEach, partition} from 'ramda'
import {dispatch} from '../store'
import audioContext from '../audioContext'
import {
  addAudioGraphSource,
  removeKeysFromAudioGraphContaining
} from '../actions'

const dispatchAddAudioGraphSource = compose(dispatch, addAudioGraphSource)

const timeoutPeriod = (source, currentTime) =>
  (source.params.startTime - audioContext.currentTime) * 1000 - 50

let activeNotes = []
let loopActive = false

export const startLoop = (audioGraphFragments) => {
  loopActive = true
  const generator = audioGraphFragments[Symbol.iterator]()
  const firstSource = generator.next().value
  const secondSource = generator.next().value
  activeNotes = [firstSource, secondSource]
  dispatchAddAudioGraphSource(firstSource)
  const recur = (currentSource, nextSource) => _ => {
    if (!loopActive) {
      forEach(
        ({id}) => dispatch(removeKeysFromAudioGraphContaining(id)),
        activeNotes
      )
      activeNotes = []
      return
    }
    const partitioned = partition(
      x => x.params.stopTime < audioContext.currentTime,
      activeNotes
    )
    activeNotes = partitioned[1]
    forEach(
      ({id}) => dispatch(removeKeysFromAudioGraphContaining(id)),
      partitioned[0]
    )
    activeNotes = append(nextSource, activeNotes)
    dispatchAddAudioGraphSource(currentSource)
    setTimeout(
      recur(nextSource, generator.next().value),
      timeoutPeriod(nextSource, audioContext.currentTime)
    )
  }
  setTimeout(
    recur(secondSource, generator.next().value),
    timeoutPeriod(secondSource, audioContext.currentTime)
  )
}

export const stopLoop = _ => loopActive = false
