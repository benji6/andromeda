import {
  add,
  always,
  compose,
  ifElse,
  isEmpty,
  pluck,
} from 'ramda'

export const computeId = ifElse(isEmpty,
                                always(0),
                                compose(add(1),
                                        xs => Math.max(...xs),
                                        pluck('id')))
export const getNewestId = compose(xs => Math.max(...xs), pluck('id'))
