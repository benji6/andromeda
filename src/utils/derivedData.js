import {
  add,
  compose,
  curry,
  equals,
  find,
  flatten,
  flip,
  map,
  multiply,
  nth,
  pluck,
  prop,
  range
} from 'ramda'

const getInstance = curry((key, name, plugins) => compose(
  prop('instance'),
  find(compose(equals(name), prop('name'))), prop(key)
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
export const effectInstance = getInstance('effectInstances')
export const instrumentInstance = getInstance('instrumentInstances')
export const instrumentInstanceNames = compose(
  pluck('name'),
  prop('instrumentInstances')
)
