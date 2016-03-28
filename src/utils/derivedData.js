import {
  add,
  compose,
  curry,
  equals,
  filter,
  find,
  flatten,
  flip,
  lensProp,
  map,
  multiply,
  nth,
  range,
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

export const currentScale = ({scaleName, scales}) => scales[scaleName]
export const arpeggiatedScale = ({
  arpeggiatorPatterns,
  scale,
  controlPad: {arpeggiatorOctaves, selectedArpeggiatorPattern}
}) => arpeggiatorPatterns[selectedArpeggiatorPattern](flatten(map(
  x => map(compose(add(x), flip(nth)(currentScale(scale))), [0, 2, 4]),
  map(multiply(12), range(0, arpeggiatorOctaves)))
))
export const effectInstance = getInstance(viewEffectInstances)
export const instrumentInstance = getInstance(viewInstrumentInstances)
export const controllableInstrumentInstanceNames = compose(
  map(viewName),
  filter(x => viewInstance(x).inputNoteStart),
  viewInstrumentInstances
)
