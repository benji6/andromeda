import {
  compose,
  filter,
  find,
  map,
} from 'ramda'

export const effectInstance = (name, plugins) => find(
  x => name === x.name,
  plugins.effectInstances
).instance
export const instrumentInstance = (name, plugins) => find(
  x => name === x.name,
  plugins.instrumentInstances
).instance
export const controllableInstrumentInstanceNames = compose(
  map(x => x.name),
  filter(x => x.instance.noteStart),
  x => x.instrumentInstances
)
