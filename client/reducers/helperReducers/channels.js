import {
  append,
  findIndex,
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
} from '../../actions'
import {computeId} from '../_tools'
import channelReducer from './channel'
import {mapIndexed} from '../../tools/indexedIterators'

export const defaultChannel = {effects: [{id: computeId([]), name: 'pingPongDelay'}],
                               selectedAddEffect: 'pingPongDelay',
                               selectedAddSource: 'fm',
                               sources: ['sine']}

export const initialState = [{...defaultChannel, sources: ['detuned']},
                             defaultChannel]

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_CHANNEL_EFFECT:
    case ADD_CHANNEL_SOURCE:
    case REMOVE_CHANNEL_EFFECT:
    case REMOVE_CHANNEL_SOURCE:
    case UPDATE_SELECTED_ADD_SOURCE:
    case UPDATE_SELECTED_ADD_EFFECT:
      return mapIndexed((channel, i) => channelReducer(channel, action, i),
                        state)
    case ADD_CHANNEL: return append(channelReducer(), state)
    case REMOVE_CHANNEL: return remove(action.payload, 1, state)
    case MOVE_CHANNEL_EFFECT_DOWN: {
      const {channelId, effectId} = action.payload
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
      const {channelId, effectId} = action.payload
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
    default: return state
  }
}
