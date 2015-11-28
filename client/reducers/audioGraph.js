import {
  equals, filter, find, isEmpty, keys, length, map, reduce, toPairs, update, zipObj,
} from 'ramda';
import {reduceIndexed} from '../tools/indexedIterators'

import {ADD_CHANNEL_EFFECT,
        MERGE_INTO_AUDIO_GRAPH,
        MOVE_CHANNEL_EFFECT_DOWN,
        REMOVE_KEYS_FROM_AUDIO_GRAPH_CONTAINING} from '../actions'
import {initialState as channelsInitialState} from './channels'

const computeKey = (channelId, index) => `channel:${channelId}-index:${index}`
export const computeInitialState = reduceIndexed((acc, {effects}, channelId) => ({...acc, ...reduceIndexed((acc1, effect, i) => ({...acc1, [computeKey(channelId, i)]: [effect, i === 0 ? 'output' : computeKey(channelId, i - 1)]}),
                                                                                                           {},
                                                                                                           effects)}),
       {})
export const initialState = computeInitialState(channelsInitialState);

export default (state = initialState, {type, value}) => {
  switch (type) {
    case MERGE_INTO_AUDIO_GRAPH:
      return {...state, ...value}
    case MOVE_CHANNEL_EFFECT_DOWN: {
      const {channelId, effectId} = value
      const connectorKey = computeKey(channelId, effectId);
      const connector = state[connectorKey];
      const connecteeKey = state[connectorKey][1]
      const connectee = state[connecteeKey];
      const connecteeOutput = state[connecteeKey][1]
      const pairsConnectedToConnector = find(([_, [__, output]]) => equals(connectorKey, output), toPairs(state))
      if (pairsConnectedToConnector) {
        const keyConnectedToConnector = pairsConnectedToConnector[0]
        const connectedToConnector = state[keyConnectedToConnector]
        return {...state,
                [connectorKey]: update(1, connecteeOutput, connector),
                [connecteeKey]: update(1, connectorKey, connectee),
                [keyConnectedToConnector]: update(1, connecteeKey, connectedToConnector)}
      }
      return {...state,
              [connectorKey]: update(1, connecteeOutput, connector),
              [connecteeKey]: update(1, connectorKey, connectee)}
    }
    case REMOVE_KEYS_FROM_AUDIO_GRAPH_CONTAINING:
      const keysToKeep = filter(key => key.indexOf(value) === -1, keys(state))
      return zipObj(keysToKeep, map(key => state[key], keysToKeep))
    case ADD_CHANNEL_EFFECT: {
      const {channelId, effect} = value
      const currentNumberOfEffects = length(filter(x => x.indexOf(`channel:${channelId}`) !== -1,
                                                   keys(state)))
      const channelKey = computeKey(channelId, currentNumberOfEffects)
      if (currentNumberOfEffects === 0) {
        return {...state, [channelKey]: [effect, 'output']};
      }
      const output = computeKey(channelId, currentNumberOfEffects - 1)
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
