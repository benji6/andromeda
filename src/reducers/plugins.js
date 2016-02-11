import audioContext from '../audioContext'
import {
  append,
  compose,
  equals,
  filter,
  find,
  last,
  lensProp,
  prop,
  propEq,
  over,
  view
} from 'ramda'
import {
  INSTANTIATE_EFFECT,
  INSTANTIATE_INSTRUMENT,
  LOAD_PLUGIN_EFFECT,
  LOAD_PLUGIN_INSTRUMENT
} from '../actions'

const destination = view(lensProp('destination'))
const overInstrumentPlugins = over(lensProp('instrumentPlugins'))
const overEffectPlugins = over(lensProp('effectPlugins'))
const overEffectInstances = over(lensProp('effectInstances'))
const overInstrumentInstances = over(lensProp('instrumentInstances'))
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
