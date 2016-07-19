import {forEach} from 'ramda'
import {APP_INITIALIZE, sampleFetched} from '../actions'
import {samples as samplesUri} from '../constants/uris'
import sampleNames from '../constants/sampleNames'
import audioContext from '../audioContext'

export default ({dispatch}) => next => action => {
  if (action.type === APP_INITIALIZE) {
    forEach(
      filename => window.fetch(`${samplesUri}/${filename}`)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(buffer => dispatch(sampleFetched([filename, buffer]))),
      sampleNames
    )
  }
  next(action)
}
