import audioGraphReducer from './helperReducers/audioGraph'
import channelsReducer from './helperReducers/channels'

export default (state = {}, action) => {
  const channels = channelsReducer(state.channels, action)
  const audioGraph = audioGraphReducer(state.audioGraph, action, channels)
  return {
    audioGraph,
    channels
  }
}
