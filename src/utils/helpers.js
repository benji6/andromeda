import {
  addIndex,
  curry,
  find,
  forEach,
  map,
  pluck,
  reduce,
  sort,
} from 'ramda'

export const findById = curry((id, xs) => find(x => x.id === id, xs))
export const forEachIndexed = addIndex(forEach)
export const mapIndexed = addIndex(map)
export const newId = xs => {
  const sortedIds = sort((a, b) => a - b, pluck('id', xs))
  let id = 0
  while (sortedIds[id] === id && id < sortedIds.length) id++
  return id
}
export const noop = () => {}
export const randomElement = xs => xs[Math.floor(Math.random() * xs.length)]
export const reduceIndexed = addIndex(reduce)
