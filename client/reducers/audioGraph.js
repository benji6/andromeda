import {
  dissoc,
  equals,
  filter,
  find,
  isEmpty,
  keys,
  map,
  reduce,
  toPairs,
  update,
  zipObj,
} from 'ramda';
import {
  ADD_CHANNEL_EFFECT,
  MERGE_INTO_AUDIO_GRAPH,
  MOVE_CHANNEL_EFFECT_DOWN,
  MOVE_CHANNEL_EFFECT_UP,
  REMOVE_CHANNEL,
  REMOVE_CHANNEL_EFFECT,
  REMOVE_KEYS_FROM_AUDIO_GRAPH_CONTAINING,
} from '../actions'
import {reduceIndexed} from '../tools/indexedIterators'
import {initialState as channelsInitialState} from './channels'
import {computeId} from './_tools'

const computeKey = (channelId, index) => `channel:${channelId}-index:${index}`
export const computeInitialState = reduceIndexed((acc, {effects}, channelId) => ({...acc, ...reduceIndexed((acc1, effect, i) => ({...acc1, [computeKey(channelId, i)]: [effect.name, i === 0 ? 'output' : computeKey(channelId, i - 1)]}),
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
      const targetKey = computeKey(channelId, effectId);
      const target = state[targetKey];
      const parentKey = find(([_, [__, output]]) => equals(targetKey, output), toPairs(state))[0]
      const parent = state[parentKey]
      const childKey = state[targetKey][1]
      const grandParentPairs = find(([_, [__, output]]) => equals(parentKey, output), toPairs(state))
      if (grandParentPairs) {
        const [grandParentKey, grandParent] = grandParentPairs
        return {...state,
                [targetKey]: update(1, parentKey, target),
                [parentKey]: update(1, childKey, parent),
                [grandParentKey]: update(1, targetKey, grandParent)}
      }
      return {...state,
              [targetKey]: update(1, parentKey, target),
              [parentKey]: update(1, childKey, parent)}
    }
    case MOVE_CHANNEL_EFFECT_UP: {
      const {channelId, effectId} = value
      const targetKey = computeKey(channelId, effectId);
      const target = state[targetKey];
      const childKey = state[targetKey][1]
      const child = state[childKey];
      const childOutput = state[childKey][1]
      const parentPairs = find(([_, [__, output]]) => equals(targetKey, output), toPairs(state))
      if (parentPairs) {
        const [parentKey, parent] = parentPairs
        return {...state,
                [targetKey]: update(1, childOutput, target),
                [childKey]: update(1, targetKey, child),
                [parentKey]: update(1, childKey, parent)}
      }
      return {...state,
              [targetKey]: update(1, childOutput, target),
              [childKey]: update(1, targetKey, child)}
    }
    case REMOVE_CHANNEL:
      return reduce((acc, val) => ({...acc, [val]: state[val]}),
                    {},
                    filter(x => x.indexOf(`channel:${value}`) === -1, keys(state)))
    case REMOVE_CHANNEL_EFFECT: {
      const {channelId, effectId} = value
      const targetKey = computeKey(channelId, effectId)
      const parentPairs = find(([_, [__, output]]) => equals(targetKey, output), toPairs(state))
      if (!parentPairs) return dissoc(targetKey, state)
      const [parentKey, parent] = parentPairs
      const childKey = state[targetKey][1]
      return {...dissoc(targetKey, state), [parentKey]: update(1, childKey, parent)}
    }
    case REMOVE_KEYS_FROM_AUDIO_GRAPH_CONTAINING:
      const keysToKeep = filter(key => key.indexOf(value) === -1, keys(state))
      return zipObj(keysToKeep, map(key => state[key], keysToKeep))
    case ADD_CHANNEL_EFFECT: {
      const {channelId, effect, effects} = value
      const effectId = computeId(effects)
      const channelKey = computeKey(channelId, effectId)
      if (effectId === 0) {
        return {...state, [channelKey]: [effect, 'output']};
      }
      const output = computeKey(channelId, effectId - 1)
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
