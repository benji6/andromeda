import {
  compose,
  curry,
  equals,
  filter,
  find,
  lensProp,
  map,
  view
} from 'ramda'

const viewEffectInstances = view(lensProp('effectInstances'))
const viewInstance = view(lensProp('instance'))
const viewInstrumentInstances = view(lensProp('instrumentInstances'))
const viewName = view(lensProp('name'))

const getInstance = curry((viewLens, name, plugins) => compose(
  viewInstance,
  find(compose(equals(name), viewName)),
  viewLens
)(plugins))

export const effectInstance = getInstance(viewEffectInstances)
export const instrumentInstance = getInstance(viewInstrumentInstances)
export const controllableInstrumentInstanceNames = compose(
  map(viewName),
  filter(x => viewInstance(x).inputNoteStart),
  viewInstrumentInstances
)
