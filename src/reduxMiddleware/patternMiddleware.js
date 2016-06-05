import {forEach} from 'ramda'
import {
  PATTERN_PLAYING_START,
  PATTERN_PLAYING_STOP,
} from '../actions'

export default () => next => action => {
  switch (action.type) {
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
