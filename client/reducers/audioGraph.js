import {
  filter, isEmpty, keys, length, map, reduce, toPairs, zipObj,
} from 'ramda';
import {reduceIndexed} from '../tools/indexedIterators'

import {ADD_CHANNEL_EFFECT,
        MERGE_INTO_AUDIO_GRAPH,
        REMOVE_KEYS_FROM_AUDIO_GRAPH_CONTAINING} from '../actions'
import {initialState as channelsInitialState} from './channels'

const computeChannelKey = (channelId, index) => `channel:${channelId}-index:${index}`

export const computeInitialState = reduceIndexed((acc, {effects}, channelId) => ({...acc, ...reduceIndexed((acc1, effect, i) => ({...acc1, [computeChannelKey(channelId, i)]: [effect, i === 0 ? 'output' : computeChannelKey(channelId, i - 1)]}),
                                                                                              {},
                                                                                              effects)}),
       {})

export const initialState = computeInitialState(channelsInitialState);

export default (state = initialState, {type, value}) => {
  switch (type) {
    case MERGE_INTO_AUDIO_GRAPH:
      return {...state, ...value}
    case REMOVE_KEYS_FROM_AUDIO_GRAPH_CONTAINING:
      const keysToKeep = filter(key => key.indexOf(value) === -1, keys(state))
      return zipObj(keysToKeep, map(key => state[key], keysToKeep))
    case ADD_CHANNEL_EFFECT: {
      const {channelId, effect} = value
      const currentNumberOfEffects = length(filter(x => x.indexOf(`channel:${channelId}`) !== -1,
                                                   keys(state)))
      const channelKey = computeChannelKey(channelId, currentNumberOfEffects)
      if (currentNumberOfEffects === 0) {
        return {...state, [channelKey]: [effect, 'output']};
      }
      const output = computeChannelKey(channelId, currentNumberOfEffects - 1)
      const keyValuesConnectedToPreviousTail = filter(([_, [__, currentOutput]]) => currentOutput === output,
                                                      toPairs(state))
      if (isEmpty(keyValuesConnectedToPreviousTail)) {
        return {...state, [channelKey]: [effect, output]};
      }
      return {...reduce((acc, [key, [name, _, ...rest]]) => ({...acc,
                                                              [key]: [name,
                                                                      channelKey,
                                                                      ...rest]}),
                        state,
                        keyValuesConnectedToPreviousTail),
              [channelKey]: [effect, output]}
    }
    default:
      return state;
  }
};
