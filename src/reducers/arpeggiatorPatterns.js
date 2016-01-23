import {cycle} from 'imlazy'
import {compose, concat, nth, reverse} from 'ramda'

export const initialState = {
  random: xs => ({[Symbol.iterator]: function * () {
    while (true) yield nth(Math.floor(Math.random() * xs.length), xs)
  }}),
  up: cycle,
  down: compose(cycle, reverse),
  'up and down': xs => cycle(concat(xs, reverse(xs)))
}

export default (state = initialState, action) => state
