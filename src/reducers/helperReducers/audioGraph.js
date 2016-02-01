import {
  compose,
  curry,
  dissoc,
  equals,
  filter,
  find,
  isEmpty,
  keys,
  nth,
  propEq,
  reduce,
  toPairs,
  update
} from 'ramda'
import {
  ADD_CHANNEL_EFFECT,
  MOVE_CHANNEL_EFFECT_DOWN,
  MOVE_CHANNEL_EFFECT_UP,
  REMOVE_CHANNEL,
  REMOVE_CHANNEL_EFFECT
} from '../../actions'
import {reduceIndexed} from '../../utils/helpers'
import {initialState as channelsInitialState} from './channels'
import {getNewestId} from '../_tools'

const computeKey = curry((type, channelId, id) => `channel:${channelId}-type:${type}-id:${id}`)
const computeEffectKey = computeKey('effect')
const second = nth(1)
const findParentPairs = curry((targetKey, statePairs) => find(compose(equals(targetKey), second, second), statePairs))
export const computeInitialState = reduceIndexed((acc, {effects}, channelId) => ({...acc, ...reduceIndexed((acc1, effect, i) => ({...acc1, [computeEffectKey(channelId, i)]: [effect.name, i === 0 ? 'output' : computeEffectKey(channelId, i - 1)]}),
                                                                                                           {},
                                                                                                           effects)}),
       {})
export const initialState = computeInitialState(channelsInitialState)

export default (state = initialState, {type, payload}, channels) => {
  switch (type) {
    case MOVE_CHANNEL_EFFECT_DOWN: {
      const {channelId, effectId} = payload
      const targetKey = computeEffectKey(channelId, effectId)
      const target = state[targetKey]
      const parentKey = findParentPairs(targetKey, toPairs(state))[0]
      const parent = state[parentKey]
      const childKey = state[targetKey][1]
      const grandParentPairs = findParentPairs(parentKey, toPairs(state))
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
      const {channelId, effectId} = payload
      const targetKey = computeEffectKey(channelId, effectId)
      const target = state[targetKey]
      const childKey = state[targetKey][1]
      const child = state[childKey]
      const childOutput = state[childKey][1]
      const parentPairs = findParentPairs(targetKey, toPairs(state))
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
                    filter(x => x.indexOf(`channel:${payload}-`) === -1,
                           keys(state)))
    case REMOVE_CHANNEL_EFFECT: {
      const {channelId, effectId} = payload
      const targetKey = computeEffectKey(channelId, effectId)
      const parentPairs = findParentPairs(targetKey, toPairs(state))
      if (!parentPairs) return dissoc(targetKey, state)
      const [parentKey, parent] = parentPairs
      const childKey = state[targetKey][1]
      return {...dissoc(targetKey, state), [parentKey]: update(1, childKey, parent)}
    }
    case ADD_CHANNEL_EFFECT: {
      const {channelId, effect} = payload
      const effectId = getNewestId(find(propEq('id', channelId), channels).effects)
      const channelKey = computeEffectKey(channelId, effectId)
      if (effectId === 0) {
        return {...state, [channelKey]: [effect, 'output']}
      }
      const output = computeEffectKey(channelId, effectId - 1)
      const keypayloadsConnectedToPreviousTail = filter(([_, [__, currentOutput]]) => currentOutput === output,
                                                      toPairs(state))
      if (isEmpty(keypayloadsConnectedToPreviousTail)) {
        return {...state, [channelKey]: [effect, output]}
      }
      return {...reduce((acc, [key, [name, _, ...rest]]) => ({...acc,
                                                              [key]: [name,
                                                                      channelKey,
                                                                      ...rest]}),
                        state,
                        keypayloadsConnectedToPreviousTail),
              [channelKey]: [effect, output]}
    }
    default: return state
  }
}
