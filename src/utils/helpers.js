import {
  addIndex,
  forEach,
  map,
  reduce,
} from 'ramda'

export const forEachIndexed = addIndex(forEach)
export const mapIndexed = addIndex(map)
export const randomElement = xs => xs[Math.floor(Math.random() * xs.length)]
export const reduceIndexed = addIndex(reduce)
export const noop = () => {}
