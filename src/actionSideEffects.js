import {forEach} from 'ramda'
import {
  BPM_SET,
  PATTERN_PLAYING_START,
  PATTERN_PLAYING_STOP,
} from './actions'

export default store => next => action => {
  switch (action.type) {
    case BPM_SET: {
      const {plugins: {effectInstances, instrumentInstances}} = store.getState()
      forEach(x => x.instance.setBpm(action.payload), effectInstances)
      forEach(x => x.instance.setBpm(action.payload), instrumentInstances)
      break
    }
    case PATTERN_PLAYING_START:
      setTimeout(action.payload.callback)
      break
    case PATTERN_PLAYING_STOP: {
      const {animationFrameRequest, activeNotes, timeoutId} = action.payload
      forEach(({id, instrumentObj}) => instrumentObj.noteStop(id), activeNotes)
      clearTimeout(timeoutId)
      cancelAnimationFrame(animationFrameRequest)
    }
  }
  next(action)
}
