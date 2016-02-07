import audioContext from '../audioContext'
import {
  append,
  compose,
  equals,
  find,
  lensProp,
  prop,
  over
} from 'ramda'
import {
  INSTANTIATE_INSTRUMENT,
  LOAD_PLUGIN_EFFECT,
  LOAD_PLUGIN_INSTRUMENT
} from '../actions'

const overInstrumentPlugins = over(lensProp('instrumentPlugins'))
const overEffectPlugins = over(lensProp('effectPlugins'))
const overInstrumentInstances = over(lensProp('instrumentInstances'))
const instrumentContstructor = (name, state) => find(
  compose(equals(name), prop('name')),
  state
).constructor

const initialState = {
  channels: [],
  effectPlugins: [],
  instrumentInstances: [],
  instrumentPlugins: []
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case INSTANTIATE_INSTRUMENT: {
      const instance = new (instrumentContstructor(payload.plugin, state.instrumentPlugins))({audioContext})
      instance.connect(audioContext.destination)
      return overInstrumentInstances(append({instance, name: payload.name}), state)
    }
    case LOAD_PLUGIN_INSTRUMENT: return overInstrumentPlugins(append(payload), state)
    case LOAD_PLUGIN_EFFECT: return overEffectPlugins(append(payload), state)
    default: return state
  }
}
