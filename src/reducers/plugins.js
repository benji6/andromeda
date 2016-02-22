import audioContext from '../audioContext'
import {
  adjust,
  append,
  compose,
  curry,
  equals,
  find,
  findIndex,
  isEmpty,
  last,
  length,
  lensProp,
  propEq,
  over,
  view
} from 'ramda'
import {
  ADD_CHANNEL,
  ADD_INSTRUMENT_TO_CHANNEL,
  INSTANTIATE_EFFECT,
  INSTANTIATE_INSTRUMENT,
  LOAD_PLUGIN_EFFECT,
  LOAD_PLUGIN_INSTRUMENT
} from '../actions'

const channelsLens = lensProp('channels')
const effectsLens = lensProp('effects')
const effectInstancesLens = lensProp('effectInstances')
const instrumentInstancesLens = lensProp('instrumentInstances')

const channels = view(channelsLens)
const constructor = view(lensProp('constructor'))
const destination = view(lensProp('destination'))
const effects = view(effectsLens)
const effectInstances = view(effectInstancesLens)
const instance = view(lensProp('instance'))
const instrumentInstances = view(instrumentInstancesLens)
const name = view(lensProp('name'))

const overChannels = over(channelsLens)
const overEffectInstances = over(effectInstancesLens)
const overEffectPlugins = over(lensProp('effectPlugins'))
const overEffects = over(effectsLens)
const overInstrumentInstances = over(instrumentInstancesLens)
const overInstrumentPlugins = over(lensProp('instrumentPlugins'))
const overInstruments = over(lensProp('instruments'))

const instanceDestination = compose(destination, instance)
const nameEquals = x => compose(equals(x), name)
const findNameEquals = curry((x, y) => compose(find, nameEquals)(x)(y))
const findConstructor = compose(constructor, findNameEquals)

const findChannelByName = curry((a, b) => findNameEquals(a, channels(b)))
const findEffectInstanceByName = curry((a, b) => findNameEquals(a, effectInstances(b)))

const createChannel = name => ({name, effects: [], instruments: []})

const initialState = {
  channels: [
    {name: 0, effects: [], instruments: []},
    {name: 1, effects: [], instruments: []},
    {name: 2, effects: [], instruments: []}
  ],
  effectInstances: [],
  effectPlugins: [],
  instrumentInstances: [],
  instrumentPlugins: []
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case ADD_CHANNEL: return overChannels(
      append(createChannel(length(channels(state)))),
      state
    )
    case ADD_INSTRUMENT_TO_CHANNEL: {
      const instrument = instance(find(
        propEq('name', payload.name),
        instrumentInstances(state)
      ))
      instrument.disconnect()
      const lastEffect = last(effects(findChannelByName(
        payload.channel,
        state
      )))
      if (!lastEffect) {
        instrument.connect(destination(audioContext))
      } else {
        instrument.connect(instanceDestination(findEffectInstanceByName(
          lastEffect,
          state
        )))
      }
      return overChannels(
        adjust(
          overInstruments(append(payload.name)),
          findIndex(nameEquals(payload.channel), channels(state))
        ),
        state
      )
    }
    case INSTANTIATE_EFFECT: {
      const instance = new (findConstructor(
        payload.plugin,
        state.effectPlugins
      ))({audioContext})
      const thisChannel = findChannelByName(payload.channel, state)
      if (!thisChannel) instance.connect(destination(audioContext))
      const thisChannelEffects = effects(thisChannel)
      if (isEmpty(thisChannelEffects)) {
        instance.connect(destination(audioContext))
      } else {
        instance.connect(instanceDestination(findEffectInstanceByName(
          last(thisChannelEffects),
          state
        )))
      }
      return overChannels(
        adjust(
          overEffects(append(payload.name)),
          findIndex(nameEquals(payload.channel), channels(state))
        ),
        overEffectInstances(append({
          instance,
          name: payload.name
        }), state)
      )
    }
    case INSTANTIATE_INSTRUMENT: {
      const instance = new (findConstructor(
        payload.plugin,
        state.instrumentPlugins
      ))({audioContext})
      instance.connect(audioContext.destination)
      return overInstrumentInstances(append({instance, name: payload.name}), state)
    }
    case LOAD_PLUGIN_INSTRUMENT: return overInstrumentPlugins(append(payload), state)
    case LOAD_PLUGIN_EFFECT: return overEffectPlugins(append(payload), state)
    default: return state
  }
}
