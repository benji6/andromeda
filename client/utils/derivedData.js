import {add, compose, flatten, flip, map, multiply, nth, range} from 'ramda'

export const currentScale = ({scaleName, scales}) => scales[scaleName]
export const arpeggiatedScale = ({
  arpeggiatorPatterns,
  scale,
  controlPad: {arpeggiatorOctaves, selectedArpeggiatorPattern}
}) => arpeggiatorPatterns[selectedArpeggiatorPattern](flatten(map(
  x => map(compose(add(x), flip(nth)(currentScale(scale))), [0, 2, 4]),
  map(multiply(12), range(0, arpeggiatorOctaves)))
))
