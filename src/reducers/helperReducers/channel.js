import {
  append,
  reject,
  remove
} from 'ramda'
import {
  ADD_CHANNEL_EFFECT,
  ADD_CHANNEL_SOURCE,
  REMOVE_CHANNEL_EFFECT,
  REMOVE_CHANNEL_SOURCE,
  UPDATE_SELECTED_ADD_EFFECT,
  UPDATE_SELECTED_ADD_SOURCE
} from '../../actions'
import {computeId} from '../_tools'

export const createChannel = id => ({
  effects: [],
  id,
  selectedAddEffect: 'pingPongDelay',
  selectedAddSource: 'detuned',
  sources: []
})

export const initialState = {
  effects: [{id: 0, name: 'pingPongDelay'}],
  id: 0,
  selectedAddEffect: 'pingPongDelay',
  selectedAddSource: 'fm',
  sources: ['sine']
}

export default (state = initialState, action) => {
  const {payload} = action || {}
  const channelId = payload && payload.channelId
  if (state.id === channelId) {
    switch (action.type) {
      case ADD_CHANNEL_EFFECT:
        return {
          ...state,
          effects: append({
            id: computeId(state.effects),
            name: payload.effect
          }, state.effects)
        }
      case ADD_CHANNEL_SOURCE:
        return {...state, sources: [...state.sources, payload.source]}
      case REMOVE_CHANNEL_SOURCE:
        return {
          ...state,
          sources: remove(payload.sourceId, 1, state.sources),
          selectedAddSource: state.selectedAddSource ||
            state.sources[payload.sourceId]
        }
      case REMOVE_CHANNEL_EFFECT:
        return {
          ...state,
          effects: reject(effect => effect.id === payload.effectId,
                          state.effects)
        }
      case UPDATE_SELECTED_ADD_SOURCE:
        return {
          ...state,
          selectedAddSource: payload.selectedAddSource
        }
      case UPDATE_SELECTED_ADD_EFFECT:
        return {
          ...state,
          selectedAddEffect: payload.selectedAddEffect
        }
      default: return state
    }
  }
  return state
}
