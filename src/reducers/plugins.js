import audioContext from '../audioContext'
import {
  adjust,
  append,
  compose,
  contains,
  curry,
  equals,
  find,
  findIndex,
  flip,
  forEach,
  isEmpty,
  last,
  lensProp,
  over,
  pluck,
  propEq,
  reject,
  sortBy,
  view
} from 'ramda'
import {
  ADD_CHANNEL,
  ADD_INSTRUMENT_TO_CHANNEL,
  INSTANTIATE_EFFECT,
  INSTANTIATE_INSTRUMENT,
  LOAD_PLUGIN_EFFECT,
  LOAD_PLUGIN_INSTRUMENT,
  REMOVE_CHANNEL,
  REMOVE_INSTRUMENT_FROM_CHANNEL
} from '../actions'

const channelsLens = lensProp('channels')
const effectsLens = lensProp('effects')
const effectInstancesLens = lensProp('effectInstances')
const instrumentInstancesLens = lensProp('instrumentInstances')
const instrumentsLens = lensProp('instruments')

const channels = view(channelsLens)
const constructor = view(lensProp('constructor'))
const destination = view(lensProp('destination'))
const effects = view(effectsLens)
const effectInstances = view(effectInstancesLens)
const instance = view(lensProp('instance'))
const instruments = view(instrumentsLens)
const instrumentInstances = view(instrumentInstancesLens)
const name = view(lensProp('name'))

const overChannels = over(channelsLens)
const overEffectInstances = over(effectInstancesLens)
const overEffectPlugins = over(lensProp('effectPlugins'))
const overEffects = over(effectsLens)
const overInstrumentInstances = over(instrumentInstancesLens)
const overInstrumentPlugins = over(lensProp('instrumentPlugins'))
const overInstruments = over(instrumentsLens)

const nameEquals = x => compose(equals(x), name)
const findNameEquals = curry((x, y) => compose(find, nameEquals)(x)(y))
const findConstructor = compose(constructor, findNameEquals)
const sortByName = sortBy(name)

const findChannelByName = curry((a, b) => findNameEquals(a, channels(b)))
const findEffectInstanceByName = curry((a, b) => instance(findNameEquals(a, effectInstances(b))))
const findInstrumentInstanceByName = curry((a, b) => instance(findNameEquals(a, instrumentInstances(b))))

const createChannel = name => ({name, effects: [], instruments: []})
const lowestUniqueNatural = xs => {
  let i = 0
  while (contains(i, xs)) i++
  return i
}
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

const connectToAudioCtx = x => (x.connect(destination(audioContext)), x)
const disconnect = x => (x.disconnect(), x)

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case ADD_CHANNEL: return overChannels(
      compose(
        sortByName,
        append(createChannel(lowestUniqueNatural(pluck(
          'name',
          channels(state)
        ))))
      ),
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
      if (!lastEffect) connectToAudioCtx(instrument)
      else {
        instrument.connect(destination(findEffectInstanceByName(
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
      if (!thisChannel) connectToAudioCtx(instance)
      const thisChannelEffects = effects(thisChannel)
      if (isEmpty(thisChannelEffects)) connectToAudioCtx(instance)
      else {
        instance.connect(destination(findEffectInstanceByName(
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
      connectToAudioCtx(instance)
      return overInstrumentInstances(
        append({instance, name: payload.name}),
        state
      )
    }
    case LOAD_PLUGIN_INSTRUMENT:
      return overInstrumentPlugins(append(payload), state)
    case LOAD_PLUGIN_EFFECT:
      return overEffectPlugins(append(payload), state)
    case REMOVE_CHANNEL: {
      const channel = findNameEquals(
        payload,
        channels(state)
      )
      forEach(compose(
        disconnect,
        x => findEffectInstanceByName(x, state)
      ), effects(channel))
      forEach(compose(
        connectToAudioCtx,
        disconnect,
        flip(findInstrumentInstanceByName)(state)
      ), instruments(channel))
      return overChannels(reject(equals(channel)), state)
    }
    case REMOVE_INSTRUMENT_FROM_CHANNEL: {
      const instrument = instance(find(
        propEq('name', payload.name),
        instrumentInstances(state)
      ))
      connectToAudioCtx(disconnect(instrument))
      return overChannels(
        adjust(
          overInstruments(reject(equals(payload.name))),
          findIndex(nameEquals(payload.channel), channels(state))
        ),
        state
      )
    }
    default: return state
  }
}
