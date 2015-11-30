import {
  append,
  findIndex,
  reject,
  remove,
  update,
} from 'ramda'
import {
  ADD_CHANNEL,
  ADD_CHANNEL_EFFECT,
  ADD_CHANNEL_SOURCE,
  MOVE_CHANNEL_EFFECT_DOWN,
  MOVE_CHANNEL_EFFECT_UP,
  REMOVE_CHANNEL_EFFECT,
  REMOVE_CHANNEL_SOURCE,
  REMOVE_CHANNEL,
  UPDATE_SELECTED_ADD_EFFECT,
  UPDATE_SELECTED_ADD_SOURCE,
} from '../actions'
import {computeId} from './_tools'

export const emptyChannel = {effects: [],
                             selectedAddEffect: 'pingPongDelay',
                             selectedAddSource: 'detuned',
                             sources: []}

export const defaultChannel = {effects: [{id: computeId([]), name: 'pingPongDelay'}],
                               selectedAddEffect: 'pingPongDelay',
                               selectedAddSource: 'fm',
                               sources: ['sine']}

export const initialState = [{...defaultChannel, sources: ['detuned']},
                             defaultChannel]

export default (state = initialState, {type, value}) => {
  switch (type) {
    case ADD_CHANNEL: return append(emptyChannel, state)
    case ADD_CHANNEL_SOURCE: {
      const {channelId, source} = value
      const channel = state[channelId]
      const {sources} = channel
      return [...state.slice(0, channelId),
              {...channel, sources: [...sources, source]},
              ...state.slice(channelId + 1)]
    }
    case ADD_CHANNEL_EFFECT: {
      const {channelId, effect} = value
      const channel = state[channelId]
      const {effects} = channel
      return update(channelId,
                    {...channel,
                     effects: append({id: computeId(effects), name: effect},
                                     effects)},
                    state)
    }
    case MOVE_CHANNEL_EFFECT_DOWN: {
      const {channelId, effectId} = value
      const channel = state[channelId]
      const {effects} = channel
      const effectsIndex = findIndex(({id}) => id === effectId, effects)
      return update(channelId,
                    {...channel,
                     effects: [...effects.slice(0, effectsIndex),
                               effects[effectsIndex + 1],
                               effects[effectsIndex],
                               ...effects.slice(effectsIndex + 2)]},
                    state)
    }
    case MOVE_CHANNEL_EFFECT_UP: {
      const {channelId, effectId} = value
      const channel = state[channelId]
      const {effects} = channel
      const effectsIndex = findIndex(({id}) => id === effectId, effects)

      return update(channelId,
                    {...channel,
                     effects: [...effects.slice(0, effectsIndex - 1),
                               effects[effectsIndex],
                               effects[effectsIndex - 1],
                               ...effects.slice(effectsIndex + 1)]},
                    state)
    }
    case REMOVE_CHANNEL_SOURCE: {
      const {channelId, sourceId} = value
      const channel = state[channelId]
      const {selectedAddSource, sources} = channel
      return update(channelId,
                    {...channel,
                     sources: remove(sourceId, 1, sources),
                     selectedAddSource: selectedAddSource || sources[sourceId]},
                    state)
    }
    case REMOVE_CHANNEL: return remove(value, 1, state)
    case REMOVE_CHANNEL_EFFECT: {
      const {channelId, effectId} = value
      const channel = state[channelId]
      const {effects} = channel
      return update(channelId,
                    {...channel,
                     effects: reject(({id}) => id === effectId, effects)},
                    state)
    }
    case UPDATE_SELECTED_ADD_SOURCE: {
      const {channelId, selectedAddSource} = value
      return update(channelId, {...state[channelId], selectedAddSource}, state)
    }
    case UPDATE_SELECTED_ADD_EFFECT: {
      const {channelId, selectedAddEffect} = value
      return update(channelId, {...state[channelId], selectedAddEffect}, state)
    }
    default: return state
  }
}
