import {compose, concat, nth, reverse} from 'ramda'
import {cycle} from '../utils/lazyIterables'

export const initialState = {
  random: xs => ({[Symbol.iterator]: function * () {
    while (true) yield nth(Math.floor(Math.random() * xs.length), xs)
  }}),
  up: cycle,
  down: compose(cycle, reverse),
  'up and down': xs => cycle(concat(xs, reverse(xs)))
}

export default (state = initialState) => state
