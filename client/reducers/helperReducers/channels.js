import {
  append,
  find,
  findIndex,
  map,
  propEq,
  reject,
  update
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
  UPDATE_SELECTED_ADD_SOURCE
} from '../../actions'
import {computeId} from '../_tools'
import channelReducer, {createChannel, initialState as channelInitialState} from './channel'

export const initialState = [channelInitialState]

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_CHANNEL_EFFECT:
    case ADD_CHANNEL_SOURCE:
    case REMOVE_CHANNEL_EFFECT:
    case REMOVE_CHANNEL_SOURCE:
    case UPDATE_SELECTED_ADD_SOURCE:
    case UPDATE_SELECTED_ADD_EFFECT:
      return map(channel => channelReducer(channel, action), state)
    case ADD_CHANNEL:
      return append(
        {...createChannel(computeId(state)), id: computeId(state)},
        state
      )
    case REMOVE_CHANNEL: return reject(propEq('id', action.payload), state)
    case MOVE_CHANNEL_EFFECT_DOWN: {
      const {channelId, effectId} = action.payload
      const channel = find(propEq('id', channelId), state)
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
      const channel = find(propEq('id', channelId), state)
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
