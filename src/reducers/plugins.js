import audioContext from '../audioContext'
import {
  adjust,
  append,
  compose,
  contains,
  curry,
  dec,
  equals,
  find,
  findIndex,
  flip,
  forEach,
  inc,
  isEmpty,
  last,
  length,
  lensProp,
  nth,
  over,
  pluck,
  propEq,
  sortBy,
  view,
  without
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

const overChannelEffects = curry((f, channelId, state) => overChannels(
  adjust(overEffects(f), findIndex(nameEquals(channelId), channels(state))),
  state
))
const overChannelInstruments = curry((f, channelId, state) => overChannels(
  adjust(overInstruments(f), findIndex(nameEquals(channelId), channels(state))),
  state
))
const channel = curry((a, b) => findNameEquals(a, channels(b)))
const effectInstance = curry((a, b) => instance(findNameEquals(a, effectInstances(b))))
const effectInstanceDestination = compose(destination, effectInstance)
const instrumentInstance = curry((a, b) => instance(findNameEquals(a, instrumentInstances(b))))

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
      const instance = new (findConstructor(
        payload.plugin,
        state.effectPlugins
      ))({audioContext})
      const thisChannel = channel(payload.channel, state)
      if (!thisChannel) connectToAudioCtx(instance)
      const thisChannelEffects = effects(thisChannel)
      if (isEmpty(thisChannelEffects)) connectToAudioCtx(instance)
      else {
        instance.connect(effectInstanceDestination(
          last(thisChannelEffects),
          state
        ))
      }
      return overChannelEffects(
        append(payload.name),
        payload.channel,
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
      } else if (effectIndex === dec(length(channelEffects))) {
        forEach(
          name => instrumentInstance(name, state)
            .connect(effectInstanceDestination(
              nth(dec(effectIndex), channelEffects),
              state
            )),
          channelInstruments
        )
      } else if (effectIndex === 0) {
        connectToAudioCtx(disconnect(effectInstance(
          nth(inc(effectIndex), channelEffects),
          state
        )))
      } else {
        disconnect(effectInstance(
          nth(inc(effectIndex), channelEffects),
          state
        )).connect(effectInstanceDestination(
          nth(dec(effectIndex), channelEffects),
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
