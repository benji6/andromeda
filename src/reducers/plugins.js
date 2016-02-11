import audioContext from '../audioContext'
import {
  adjust,
  append,
  assoc,
  compose,
  equals,
  filter,
  find,
  findIndex,
  last,
  lensProp,
  prop,
  propEq,
  over,
  view
} from 'ramda'
import {
  ADD_INSTRUMENT_TO_CHANNEL,
  INSTANTIATE_EFFECT,
  INSTANTIATE_INSTRUMENT,
  LOAD_PLUGIN_EFFECT,
  LOAD_PLUGIN_INSTRUMENT
} from '../actions'

const instrumentInstancesLens = lensProp('instrumentInstances')
const effectInstancesLens = lensProp('effectInstances')
const instrumentInstances = view(instrumentInstancesLens)
const instance = view(lensProp('instance'))
const destination = view(lensProp('destination'))
const overInstrumentPlugins = over(lensProp('instrumentPlugins'))
const overEffectPlugins = over(lensProp('effectPlugins'))
const overEffectInstances = over(effectInstancesLens)
const effectInstances = view(effectInstancesLens)
const overInstrumentInstances = over(instrumentInstancesLens)
const effectContstructor = (name, state) => find(
  compose(equals(name), prop('name')),
  state
).constructor
const instrumentContstructor = (name, state) => find(
  compose(equals(name), prop('name')),
  state
).constructor
const filterChannel = (channel, xs) => filter(propEq('channel', channel), xs)

const initialState = {
  effectInstances: [],
  effectPlugins: [],
  instrumentInstances: [],
  instrumentPlugins: []
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case ADD_INSTRUMENT_TO_CHANNEL: {
      const instrument = instance(find(
        propEq('name', payload.name),
        instrumentInstances(state)
      ))
      instrument.disconnect()
      instrument.connect(destination(instance(last(filterChannel(
        payload.channel,
        effectInstances(state)
      )))))
      return overInstrumentInstances(
        adjust(
          assoc('channel', payload.channel),
          findIndex(propEq('name', payload.name), instrumentInstances(state))
        ),
        state
      )
    }
    case INSTANTIATE_EFFECT: {
      const instance = new (effectContstructor(
        payload.plugin,
        state.effectPlugins
      ))({audioContext})

      const channelFx = filterChannel(payload.channel, state.effectInstances)
      if (!channelFx.length) instance.connect(destination(audioContext))
      else instance.connect(destination(last(channelFx)))

      return overEffectInstances(append({
        channel: payload.channel,
        instance,
        name: payload.name
      }), state)
    }
    case INSTANTIATE_INSTRUMENT: {
      const instance = new (instrumentContstructor(
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
