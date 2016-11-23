import audioContext from '../audioContext'
import pluginWrapperInstrument from '../utils/pluginWrapperInstrument'
import pluginWrapperEffect from '../utils/pluginWrapperEffect'
import {
  adjust,
  append,
  compose,
  curry,
  equals,
  find,
  findIndex,
  flip,
  forEach,
  last,
  length,
  lensProp,
  over,
  pluck,
  propEq,
  sortBy,
  view,
  without,
} from 'ramda'
import {
  ADD_CHANNEL,
  ADD_EFFECT_TO_CHANNEL,
  ADD_INSTRUMENT_TO_CHANNEL,
  INSTANTIATE_EFFECT,
  INSTANTIATE_INSTRUMENT,
  LOAD_PLUGIN_EFFECT,
  LOAD_PLUGIN_INSTRUMENT,
  REMOVE_CHANNEL,
  REMOVE_EFFECT_FROM_CHANNEL,
  REMOVE_INSTRUMENT_FROM_CHANNEL,
} from '../actions'
import store from '../store'

const channelsLens = lensProp('channels')
const effectsLens = lensProp('effects')
const effectInstancesLens = lensProp('effectInstances')
const instrumentInstancesLens = lensProp('instrumentInstances')
const instrumentsLens = lensProp('instruments')

const viewChannels = view(channelsLens)
const viewConstructor = view(lensProp('constructor'))
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
const findConstructor = compose(viewConstructor, findNameEquals)
const sortByName = sortBy(name)

const overChannelEffects = curry((f, channelId, state) => overChannels(
  adjust(overEffects(f), findIndex(nameEquals(channelId), viewChannels(state))),
  state
))
const overChannelInstruments = curry((f, channelId, state) => overChannels(
  adjust(overInstruments(f), findIndex(nameEquals(channelId), viewChannels(state))),
  state
))
const channel = curry((a, b) => findNameEquals(a, viewChannels(b)))
const effectInstance = curry((a, b) => instance(findNameEquals(a, effectInstances(b))))
const effectInstanceDestination = compose(destination, effectInstance)
const instrumentInstance = curry((a, b) => instance(findNameEquals(a, instrumentInstances(b))))

const createChannel = name => ({effects: [], instruments: [], name})
const lowestUniqueNatural = xs => {
  let i = 0
  while (xs.includes(i)) i++
  return i
}
const initialState = {
  channels: [{effects: [], instruments: [], name: 0}],
  effectInstances: [],
  effectPlugins: [],
  instrumentInstances: [],
  instrumentPlugins: [],
}

const connectToAudioCtx = x => (x.connect(destination(audioContext)), x)
const disconnect = x => (x.disconnect(), x)

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case ADD_CHANNEL: return overChannels(compose(
      sortByName,
      append(createChannel(lowestUniqueNatural(pluck(
        'name',
        viewChannels(state)
      ))))
    ), state)
    case ADD_EFFECT_TO_CHANNEL: {
      const thisEffectInstance = effectInstance(payload.name, state)
      const lastEffect = last(effects(channel(payload.channel, state)))
      if (!lastEffect) connectToAudioCtx(thisEffectInstance)
      else {
        thisEffectInstance.connect(effectInstanceDestination(
          lastEffect,
          state
        ))
      }
      forEach(
        name => disconnect(instrumentInstance(name, state))
          .connect(destination(thisEffectInstance)),
        instruments(channel(payload.channel, state))
      )
      return overChannelEffects(append(payload.name), payload.channel, state)
    }
    case ADD_INSTRUMENT_TO_CHANNEL: {
      const instrument = instance(find(
        propEq('name', payload.name),
        instrumentInstances(state)
      ))
      instrument.disconnect()
      const lastEffect = last(effects(channel(payload.channel, state)))
      if (!lastEffect) connectToAudioCtx(instrument)
      else instrument.connect(effectInstanceDestination(lastEffect, state))
      return overChannelInstruments(append(payload.name), payload.channel, state)
    }
    case INSTANTIATE_EFFECT: {
      const instance = pluginWrapperEffect(new (findConstructor(
        payload.plugin,
        state.effectPlugins
      ))({audioContext, bpm: store.getState().settings.bpm}))
      return overEffectInstances(append({
        instance,
        name: payload.name,
      }), state)
    }
    case INSTANTIATE_INSTRUMENT: {
      const instance = pluginWrapperInstrument(new (findConstructor(
        payload.plugin,
        state.instrumentPlugins
      ))({audioContext, bpm: store.getState().settings.bpm}))
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
        viewChannels(state)
      )
      forEach(compose(
        disconnect,
        x => effectInstance(x, state)
      ), effects(channel))
      forEach(compose(
        connectToAudioCtx,
        disconnect,
        flip(instrumentInstance)(state)
      ), instruments(channel))
      return overChannels(without([channel]), state)
    }
    case REMOVE_EFFECT_FROM_CHANNEL: {
      const channelEffects = effects(channel(payload.channel, state))
      const channelInstruments = instruments(channel(payload.channel, state))

      disconnect(effectInstance(payload.name, state))
      const effectIndex = findIndex(equals(payload.name), channelEffects)

      if (length(channelEffects) === 1) {
        forEach(
          name => connectToAudioCtx(instrumentInstance(name, state)),
          channelInstruments
        )
      } else if (effectIndex === length(channelEffects) - 1) {
        forEach(
          name => instrumentInstance(name, state)
            .connect(effectInstanceDestination(
              channelEffects[effectIndex - 1],
              state
            )),
          channelInstruments
        )
      } else if (effectIndex === 0) {
        connectToAudioCtx(disconnect(effectInstance(
          channelEffects[effectIndex + 1],
          state
        )))
      } else {
        disconnect(effectInstance(
          channelEffects[effectIndex + 1],
          state
        )).connect(effectInstanceDestination(
          channelEffects[effectIndex - 1],
          state
        ))
      }

      return overChannelEffects(without([payload.name]), payload.channel, state)
    }
    case REMOVE_INSTRUMENT_FROM_CHANNEL: {
      connectToAudioCtx(disconnect(instrumentInstance(payload.name, state)))
      return overChannelInstruments(
        without([payload.name]),
        payload.channel,
        state
      )
    }
    default: return state
  }
}
