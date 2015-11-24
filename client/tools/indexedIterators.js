import {addIndex, forEach, map, reduce} from 'ramda'
export const mapIndexed = addIndex(map)
export const forEachIndexed = addIndex(forEach)
export const reduceIndexed = addIndex(reduce)
