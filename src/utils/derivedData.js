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

export const currentScale = ({scaleName, scales}) => scales[scaleName]
export const arpeggiatedScale = ({
  arpeggiatorPatterns,
  scale,
  controlPad: {arpeggiatorOctaves, selectedArpeggiatorPattern}
}) => arpeggiatorPatterns[selectedArpeggiatorPattern](flatten(map(
  x => map(compose(add(x), flip(nth)(currentScale(scale))), [0, 2, 4]),
  map(multiply(12), range(0, arpeggiatorOctaves)))
))
export const instrumentInstance = curry((name, plugins) => compose(
  prop('instance'),
  find(compose(equals(name), prop('name'))), prop('instrumentInstances')
)(plugins))
export const instrumentInstanceNames = compose(
  pluck('name'),
  prop('instrumentInstances')
)
